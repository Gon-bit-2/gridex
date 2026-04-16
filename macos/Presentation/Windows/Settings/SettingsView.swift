// SettingsView.swift
// Gridex
//
// Settings window using SwiftUI.

import SwiftUI

struct SettingsView: View {
    var body: some View {
        TabView {
            GeneralSettingsView()
                .tabItem {
                    Label("General", systemImage: "gear")
                }

            AISettingsView()
                .tabItem {
                    Label("AI", systemImage: "brain")
                }

            EditorSettingsView()
                .tabItem {
                    Label("Editor", systemImage: "pencil")
                }
        }
        .frame(width: 580, height: 420)
    }
}

struct GeneralSettingsView: View {
    @AppStorage("general.pageSize") private var pageSize = 300
    @AppStorage("general.confirmBeforeDelete") private var confirmBeforeDelete = true
    @AppStorage("general.autoRefreshSidebar") private var autoRefreshSidebar = true
    @AppStorage("general.refreshInterval") private var refreshInterval = 300 // seconds
    @AppStorage("general.showQueryLog") private var showQueryLog = false

    var body: some View {
        Form {
            Section("Data Grid") {
                Picker("Default page size", selection: $pageSize) {
                    Text("100").tag(100)
                    Text("300").tag(300)
                    Text("500").tag(500)
                    Text("1000").tag(1000)
                }
                Toggle("Confirm before deleting rows", isOn: $confirmBeforeDelete)
            }

            Section("Sidebar") {
                Toggle("Auto-refresh schema", isOn: $autoRefreshSidebar)
                if autoRefreshSidebar {
                    Picker("Refresh interval", selection: $refreshInterval) {
                        Text("1 minute").tag(60)
                        Text("5 minutes").tag(300)
                        Text("15 minutes").tag(900)
                        Text("Never").tag(0)
                    }
                }
            }

            Section("Query") {
                Toggle("Show query log panel by default", isOn: $showQueryLog)
            }
        }
        .formStyle(.grouped)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct AISettingsView: View {
    private let keychainService: KeychainServiceProtocol = DependencyContainer.shared.keychainService

    @AppStorage("ai.provider") private var providerType = "gemini"
    @AppStorage("ai.provider.baseURL") private var baseURL = "https://generativelanguage.googleapis.com/v1beta/openai"
    @AppStorage("ai.provider.enabled") private var isEnabled = true
    @AppStorage("ai.provider.model") private var selectedModel = "gemini-2.5-flash"

    @State private var apiKey = ""
    @State private var isValidating = false
    @State private var validationResult: ValidationResult?
    @State private var availableModels: [LLMModel] = []
    @State private var isLoadingModels = false

    private enum ValidationResult {
        case success, failure(String)
    }

    private let providerTypes = [
        ("gemini", "Google Gemini"),
        ("anthropic", "Anthropic"),
        ("openai", "OpenAI"),
        ("ollama", "Ollama"),
    ]

    var body: some View {
        Form {
            Picker("Provider", selection: $providerType) {
                ForEach(providerTypes, id: \.0) { value, label in
                    Text(label).tag(value)
                }
            }
            .onChange(of: providerType) { _, newValue in
                applyProviderDefaults(newValue)
            }

            if providerType != "ollama" {
                TextField("API Base URL", text: $baseURL)
                SecureField("API Key", text: $apiKey)
            }

            HStack {
                Picker("Model", selection: $selectedModel) {
                    if availableModels.isEmpty {
                        ForEach(fallbackModels, id: \.self) { model in
                            Text(model).tag(model)
                        }
                    } else {
                        ForEach(availableModels) { model in
                            Text(model.name).tag(model.id)
                        }
                    }
                }
                Button(action: fetchModels) {
                    if isLoadingModels {
                        ProgressView()
                            .controlSize(.small)
                    } else {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                .buttonStyle(.plain)
                .disabled(isLoadingModels || (providerType != "ollama" && apiKey.isEmpty))
                .help("Fetch models from API")
            }

            Toggle("Enabled", isOn: $isEnabled)

            HStack {
                Button(action: validateConnection) {
                    HStack(spacing: 6) {
                        if isValidating {
                            ProgressView()
                                .controlSize(.small)
                        }
                        Text("Validate")
                    }
                }
                .disabled(isValidating || (providerType != "ollama" && apiKey.isEmpty))

                if let result = validationResult {
                    switch result {
                    case .success:
                        Label("Connected", systemImage: "checkmark.circle.fill")
                            .foregroundStyle(.green)
                            .font(.system(size: 12))
                    case .failure(let msg):
                        Label(msg, systemImage: "xmark.circle.fill")
                            .foregroundStyle(.red)
                            .font(.system(size: 12))
                            .lineLimit(1)
                    }
                }
            }
        }
        .formStyle(.grouped)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onAppear {
            loadAPIKey()
            fetchModels()
        }
        .onChange(of: apiKey) { _, newValue in saveAPIKey(newValue) }
    }

    private var fallbackModels: [String] {
        switch providerType {
        case "gemini": return ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"]
        case "anthropic": return ["claude-sonnet-4-6", "claude-haiku-4-5-20251001", "claude-opus-4-6"]
        case "openai": return ["gpt-4o", "gpt-4o-mini"]
        case "ollama": return ["llama3", "codellama", "mistral"]
        default: return []
        }
    }

    private func fetchModels() {
        isLoadingModels = true
        Task {
            let service = DependencyContainer.shared.makeLLMService(
                provider: providerType,
                apiKey: apiKey,
                baseURL: baseURL
            )
            do {
                let models = try await service.availableModels()
                await MainActor.run {
                    availableModels = models
                    if !models.isEmpty && !models.contains(where: { $0.id == selectedModel }) {
                        selectedModel = models[0].id
                    }
                    isLoadingModels = false
                }
            } catch {
                await MainActor.run {
                    availableModels = []
                    isLoadingModels = false
                }
            }
        }
    }

    private func applyProviderDefaults(_ provider: String) {
        switch provider {
        case "gemini":
            baseURL = "https://generativelanguage.googleapis.com/v1beta/openai"
            selectedModel = "gemini-2.5-flash"
        case "anthropic":
            baseURL = "https://api.anthropic.com/v1"
            selectedModel = "claude-sonnet-4-6"
        case "openai":
            baseURL = "https://api.openai.com/v1"
            selectedModel = "gpt-4o"
        case "ollama":
            baseURL = "http://localhost:11434"
            selectedModel = "llama3"
        default: break
        }
        loadAPIKey()
        availableModels = []
        fetchModels()
    }

    private func loadAPIKey() {
        apiKey = (try? keychainService.load(key: "ai.apikey.\(providerType)")) ?? ""
    }

    private func saveAPIKey(_ key: String) {
        if key.isEmpty {
            try? keychainService.delete(key: "ai.apikey.\(providerType)")
        } else {
            try? keychainService.save(key: "ai.apikey.\(providerType)", value: key)
        }
    }

    private func validateConnection() {
        isValidating = true
        validationResult = nil
        Task {
            do {
                let service = DependencyContainer.shared.makeLLMService(
                    provider: providerType,
                    apiKey: apiKey,
                    baseURL: baseURL
                )
                let valid = try await service.validateAPIKey()
                await MainActor.run {
                    validationResult = valid ? .success : .failure("Invalid API key")
                    isValidating = false
                }
            } catch {
                await MainActor.run {
                    validationResult = .failure(error.localizedDescription)
                    isValidating = false
                }
            }
        }
    }
}

struct EditorSettingsView: View {
    @AppStorage("editor.fontSize") private var fontSize = 12.0
    @AppStorage("editor.tabSize") private var tabSize = 4
    @AppStorage("editor.useSpaces") private var useSpaces = true
    @AppStorage("editor.wordWrap") private var wordWrap = false
    @AppStorage("editor.showLineNumbers") private var showLineNumbers = true
    @AppStorage("editor.highlightCurrentLine") private var highlightCurrentLine = true

    var body: some View {
        Form {
            Section("Font") {
                HStack {
                    Text("Font size")
                    Spacer()
                    TextField("", value: $fontSize, format: .number)
                        .frame(width: 50)
                        .textFieldStyle(.roundedBorder)
                    Stepper("", value: $fontSize, in: 8...24, step: 1)
                        .labelsHidden()
                }
            }

            Section("Indentation") {
                Picker("Tab size", selection: $tabSize) {
                    Text("2 spaces").tag(2)
                    Text("4 spaces").tag(4)
                    Text("8 spaces").tag(8)
                }
                Toggle("Use spaces instead of tabs", isOn: $useSpaces)
            }

            Section("Display") {
                Toggle("Word wrap", isOn: $wordWrap)
                Toggle("Show line numbers", isOn: $showLineNumbers)
                Toggle("Highlight current line", isOn: $highlightCurrentLine)
            }
        }
        .formStyle(.grouped)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

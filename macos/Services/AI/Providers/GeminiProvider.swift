// GeminiProvider.swift
// Gridex
//
// Google Gemini API integration via OpenAI-compatible endpoint.

import Foundation

final class GeminiProvider: LLMService, @unchecked Sendable {
    let providerName = "Gemini"
    private let apiKey: String
    private let baseURL: String

    init(apiKey: String, baseURL: String = "https://generativelanguage.googleapis.com/v1beta/openai") {
        self.apiKey = apiKey
        self.baseURL = baseURL.hasSuffix("/") ? String(baseURL.dropLast()) : baseURL
    }

    func stream(
        messages: [LLMMessage],
        systemPrompt: String,
        model: String,
        maxTokens: Int,
        temperature: Double
    ) -> AsyncThrowingStream<String, Error> {
        AsyncThrowingStream { continuation in
            Task {
                do {
                    var request = URLRequest(url: URL(string: "\(baseURL)/chat/completions")!)
                    request.httpMethod = "POST"
                    request.setValue("application/json", forHTTPHeaderField: "content-type")
                    request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "authorization")

                    var msgs: [[String: Any]] = [
                        ["role": "system", "content": systemPrompt]
                    ]
                    msgs += messages.map { ["role": $0.role.rawValue, "content": $0.content] }

                    let body: [String: Any] = [
                        "model": model,
                        "max_tokens": maxTokens,
                        "temperature": temperature,
                        "stream": true,
                        "messages": msgs
                    ]
                    request.httpBody = try JSONSerialization.data(withJSONObject: body)

                    let (stream, response) = try await URLSession.shared.bytes(for: request)

                    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                        let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
                        continuation.finish(throwing: GridexError.aiProviderError("Gemini HTTP \(statusCode)"))
                        return
                    }

                    for try await line in stream.lines {
                        guard line.hasPrefix("data: ") else { continue }
                        let data = String(line.dropFirst(6))
                        guard data != "[DONE]" else { break }

                        if let json = try? JSONSerialization.jsonObject(with: Data(data.utf8)) as? [String: Any],
                           let choices = json["choices"] as? [[String: Any]],
                           let delta = choices.first?["delta"] as? [String: Any],
                           let content = delta["content"] as? String {
                            continuation.yield(content)
                        }
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }

    func availableModels() async throws -> [LLMModel] {
        var request = URLRequest(url: URL(string: "\(baseURL)/models")!)
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "authorization")
        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            // Fallback to known models
            return defaultModels
        }

        guard let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let modelsArray = json["data"] as? [[String: Any]] else {
            return defaultModels
        }

        let models = modelsArray.compactMap { model -> LLMModel? in
            guard let id = model["id"] as? String else { return nil }
            return LLMModel(id: id, name: id, provider: providerName, contextWindow: 1000000, supportsStreaming: true)
        }

        return models.isEmpty ? defaultModels : models
    }

    private var defaultModels: [LLMModel] {
        [
            LLMModel(id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: providerName, contextWindow: 1000000, supportsStreaming: true),
            LLMModel(id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: providerName, contextWindow: 1000000, supportsStreaming: true),
            LLMModel(id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: providerName, contextWindow: 1000000, supportsStreaming: true),
        ]
    }

    func validateAPIKey() async throws -> Bool {
        var request = URLRequest(url: URL(string: "\(baseURL)/models")!)
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "authorization")
        let (_, response) = try await URLSession.shared.data(for: request)
        return (response as? HTTPURLResponse)?.statusCode == 200
    }
}

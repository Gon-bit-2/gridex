// DependencyContainer.swift
// Gridex
//
// Central dependency injection container.

import Foundation
import SwiftData

@MainActor
final class DependencyContainer {

    /// Shared instance — ensures SwiftData ModelContainer is created only once,
    /// even when multiple windows each own their own AppState.
    static let shared = DependencyContainer()

    // MARK: - SwiftData

    lazy var modelContainer: ModelContainer = {
        let schema = Schema([
            SavedConnectionEntity.self,
            QueryHistoryEntity.self,
        ])
        let config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        do {
            return try ModelContainer(for: schema, configurations: [config])
        } catch {
            fatalError("Failed to create ModelContainer: \(error)")
        }
    }()

    // MARK: - Core Services

    lazy var keychainService: KeychainServiceProtocol = KeychainService()
    lazy var schemaCache = SchemaCache()
    lazy var connectionManager = ConnectionManager()

    // MARK: - Repositories

    lazy var connectionRepository: any ConnectionRepository = SwiftDataConnectionRepository(modelContainer: modelContainer)
    lazy var queryHistoryRepository: any QueryHistoryRepository = SwiftDataQueryHistoryRepository(modelContainer: modelContainer)

    // MARK: - Services

    lazy var queryEngine: QueryEngine = {
        QueryEngine(connectionManager: connectionManager, historyRepository: queryHistoryRepository)
    }()

    lazy var schemaInspector = SchemaInspectorService(cache: schemaCache, connectionManager: connectionManager)
    lazy var aiContextEngine = AIContextEngine(schemaCache: schemaCache)
    lazy var sshTunnelService = SSHTunnelService()
    lazy var exportService = ExportService()

    // MARK: - AI

    func makeLLMService(provider: String, apiKey: String, baseURL: String? = nil) -> any LLMService {
        switch provider {
        case "anthropic": return AnthropicProvider(apiKey: apiKey)
        case "openai": return OpenAIProvider(apiKey: apiKey)
        case "ollama": return OllamaProvider()
        case "gemini": return GeminiProvider(apiKey: apiKey, baseURL: baseURL ?? "https://generativelanguage.googleapis.com/v1beta/openai")
        default: return AnthropicProvider(apiKey: apiKey)
        }
    }
}

// OllamaProvider.swift
// Gridex
//
// Local Ollama LLM integration.

import Foundation

final class OllamaProvider: LLMService, @unchecked Sendable {
    let providerName = "Ollama"
    private let baseURL: URL

    init(baseURL: URL = URL(string: "http://localhost:11434")!) {
        self.baseURL = baseURL
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
                // TODO: Implement Ollama streaming API
                continuation.finish(throwing: GridexError.unsupportedOperation("Ollama provider not yet implemented"))
            }
        }
    }

    func availableModels() async throws -> [LLMModel] {
        // TODO: GET /api/tags to list installed models
        return []
    }

    func validateAPIKey() async throws -> Bool {
        // Ollama doesn't need an API key, just check if server is running
        var request = URLRequest(url: baseURL.appendingPathComponent("/api/tags"))
        request.timeoutInterval = 5
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            return (response as? HTTPURLResponse)?.statusCode == 200
        } catch {
            return false
        }
    }
}

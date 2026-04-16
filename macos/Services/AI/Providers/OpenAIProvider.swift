// OpenAIProvider.swift
// Gridex
//
// OpenAI GPT API integration with streaming support.

import Foundation

final class OpenAIProvider: LLMService, @unchecked Sendable {
    let providerName = "OpenAI"
    private let apiKey: String

    init(apiKey: String) {
        self.apiKey = apiKey
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
                // TODO: Implement OpenAI streaming API
                continuation.finish(throwing: GridexError.unsupportedOperation("OpenAI provider not yet implemented"))
            }
        }
    }

    func availableModels() async throws -> [LLMModel] {
        [
            LLMModel(id: "gpt-4o", name: "GPT-4o", provider: providerName, contextWindow: 128000, supportsStreaming: true),
            LLMModel(id: "gpt-4o-mini", name: "GPT-4o Mini", provider: providerName, contextWindow: 128000, supportsStreaming: true),
        ]
    }

    func validateAPIKey() async throws -> Bool {
        return !apiKey.isEmpty
    }
}

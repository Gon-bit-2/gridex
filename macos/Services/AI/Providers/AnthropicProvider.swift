// AnthropicProvider.swift
// Gridex
//
// Anthropic Claude API integration with streaming support.

import Foundation

final class AnthropicProvider: LLMService, @unchecked Sendable {
    let providerName = "Anthropic"
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
                do {
                    var request = URLRequest(url: URL(string: "https://api.anthropic.com/v1/messages")!)
                    request.httpMethod = "POST"
                    request.setValue("application/json", forHTTPHeaderField: "content-type")
                    request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
                    request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

                    let body: [String: Any] = [
                        "model": model,
                        "max_tokens": maxTokens,
                        "temperature": temperature,
                        "stream": true,
                        "system": systemPrompt,
                        "messages": messages.map { ["role": $0.role.rawValue, "content": $0.content] }
                    ]
                    request.httpBody = try JSONSerialization.data(withJSONObject: body)

                    let (stream, response) = try await URLSession.shared.bytes(for: request)

                    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                        continuation.finish(throwing: GridexError.aiProviderError("HTTP error"))
                        return
                    }

                    for try await line in stream.lines {
                        guard line.hasPrefix("data: ") else { continue }
                        let data = String(line.dropFirst(6))
                        guard data != "[DONE]" else { break }

                        if let json = try? JSONSerialization.jsonObject(with: Data(data.utf8)) as? [String: Any],
                           let delta = (json["delta"] as? [String: Any])?["text"] as? String {
                            continuation.yield(delta)
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
        [
            LLMModel(id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: providerName, contextWindow: 200000, supportsStreaming: true),
            LLMModel(id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", provider: providerName, contextWindow: 200000, supportsStreaming: true),
            LLMModel(id: "claude-opus-4-6", name: "Claude Opus 4.6", provider: providerName, contextWindow: 200000, supportsStreaming: true),
        ]
    }

    func validateAPIKey() async throws -> Bool {
        // TODO: Make a minimal API call to validate
        return !apiKey.isEmpty
    }
}

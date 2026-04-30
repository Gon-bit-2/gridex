// ProviderFactory.swift
// Gridex
//
// Dispatch ProviderConfig → concrete LLMService.
// The OpenAI-compatible family all share `OpenAIProvider` with a preset baseURL,
// so adding a new vendor is usually just an enum case, not a new class.

import Foundation

enum ProviderFactory {
    /// Build the concrete `LLMService` for a config. `apiKey` is ignored for
    /// `.chatGPT` (it uses OAuth tokens via `chatGPTOAuthService`); pass empty
    /// for that case.
    ///
    /// `chatGPTOAuthService` must be provided when `config.type == .chatGPT`;
    /// other types ignore it. We pass it explicitly (rather than reach for
    /// `DependencyContainer.shared`) because the factory is callable from
    /// non-MainActor contexts (`ProviderRegistry` is an actor) — and the
    /// container is `@MainActor`-isolated.
    static func make(
        config: ProviderConfig,
        apiKey: String,
        chatGPTOAuthService: ChatGPTOAuthService? = nil
    ) -> any LLMService {
        let base = config.resolvedBaseURL
        switch config.type {
        case .anthropic:
            return AnthropicProvider(apiKey: apiKey, baseURL: base)
        case .gemini:
            return GeminiProvider(apiKey: apiKey, baseURL: base)
        case .ollama:
            return OllamaProvider(baseURLString: base)
        case .chatGPT:
            guard let svc = chatGPTOAuthService else {
                preconditionFailure("ChatGPT provider requires chatGPTOAuthService")
            }
            return ChatGPTProvider(providerId: config.id, baseURL: base, oauthService: svc)
        case .openAI, .azureOpenAI, .groq, .deepseek, .mistral, .xAI,
             .perplexity, .openRouter, .together, .fireworks, .dashscope,
             .dashscopeCoding, .openAICompatible:
            return OpenAIProvider(apiKey: apiKey, baseURL: base, probeModel: config.model)
        }
    }

    /// Convenience for legacy callers that only know the type. Cannot build a
    /// ChatGPT provider — that requires an explicit provider id + OAuth service.
    static func make(type: ProviderType, apiKey: String, baseURL: String? = nil) -> any LLMService {
        let config = ProviderConfig(
            name: type.rawValue,
            type: type,
            apiBase: baseURL,
            model: type.defaultModel
        )
        return make(config: config, apiKey: apiKey)
    }
}

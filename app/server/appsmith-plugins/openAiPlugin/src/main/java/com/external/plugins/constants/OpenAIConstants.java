package com.external.plugins.constants;

import org.springframework.web.reactive.function.client.ExchangeStrategies;

public class OpenAIConstants {

    // Endpoints
    public static final String OPEN_AI_HOST = "https://api.openai.com";
    public static final String MODELS_ENDPOINT = "/v1/models";
    public static final String CHAT_ENDPOINT = "/v1/chat/completions";
    public static final String EMBEDDINGS_ENDPOINT = "/v1/embeddings";

    // COMMANDS
    public static final String EMBEDDINGS_MODELS = "EMBEDDING_MODELS";
    public static final String CHAT_MODELS = "CHAT_MODELS";
    public static final String CHAT = "CHAT";
    public static final String EMBEDDINGS = "EMBEDDINGS";

    // Form data constants
    public static final String CHAT_MODEL_SELECTOR = "chatModel";
    public static final String EMBEDDINGS_MODEL_SELECTOR = "embeddingsModel";
    public static final String DATA = "data";
    public static final String ID = "id";
    public static final String LABEL = "label";
    public static final String VALUE = "value";
    public static final String COMMAND = "command";
    public static final String MODEL = "model";
    public static final String MESSAGES = "messages";
    public static final String INPUT = "input";
    public static final String ENCODING_FORMAT = "encodingFormat";
    public static final String TEMPERATURE = "temperature";

    // Other constants
    public static final String BODY = "body";

    public static final ExchangeStrategies EXCHANGE_STRATEGIES = ExchangeStrategies.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(/* 10MB */ 10 * 1024 * 1024))
            .build();
}

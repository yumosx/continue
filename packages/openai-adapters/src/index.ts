import dotenv from "dotenv";
import { z } from "zod";
import { AiSdkApi } from "./apis/AiSdk.js";
import { AnthropicApi } from "./apis/Anthropic.js";
import { DeepSeekApi } from "./apis/DeepSeek.js";
import { GeminiApi } from "./apis/Gemini.js";
import { MiniMaxApi } from "./apis/MiniMax.js";
import { MockApi } from "./apis/Mock.js";
import { OpenAIApi } from "./apis/OpenAI.js";
import { BaseLlmApi } from "./apis/base.js";
import { LLMConfig, OpenAIConfigSchema } from "./types.js";

dotenv.config();

function openAICompatible(
  apiBase: string,
  config: z.infer<typeof OpenAIConfigSchema>,
): OpenAIApi {
  return new OpenAIApi({
    ...config,
    apiBase: config.apiBase ?? apiBase,
  });
}

function createAiSdkApiForProvider(
  config: LLMConfig & { model?: string },
  provider: string,
): AiSdkApi | undefined {
  if (!config.model) {
    return undefined;
  }
  return new AiSdkApi({
    provider: "ai-sdk",
    model: `${provider}/${config.model}`,
    apiKey: config.apiKey,
    apiBase: config.apiBase,
    requestOptions: config.requestOptions,
  });
}

export function constructLlmApi(config: LLMConfig): BaseLlmApi | undefined {
  if (process.env.CONTINUE_USE_AI_SDK) {
    if (["openai", "anthropic"].includes(config.provider)) {
      const aiSdkApi = createAiSdkApiForProvider(
        config as LLMConfig & { model?: string },
        config.provider,
      );
      if (aiSdkApi) {
        return aiSdkApi;
      }
    }
  }

  switch (config.provider) {
    case "openai":
      return new OpenAIApi(config);
    case "anthropic":
      return new AnthropicApi(config);
    case "gemini":
      return new GeminiApi(config);
    case "deepseek":
      return new DeepSeekApi(config);
    case "zAI":
      return openAICompatible("https://api.z.ai/api/paas/v4/", config);
    case "minimax":
      return new MiniMaxApi(config);
    case "mock":
      return new MockApi();
    case "ai-sdk":
      return new AiSdkApi(config);
    default:
      return undefined;
  }
}

export {
  type ChatCompletion,
  type ChatCompletionChunk,
  type ChatCompletionCreateParams,
  type ChatCompletionCreateParamsNonStreaming,
  type ChatCompletionCreateParamsStreaming,
  type Completion,
  type CompletionCreateParams,
  type CompletionCreateParamsNonStreaming,
  type CompletionCreateParamsStreaming,
} from "openai/resources/index";

export { AiSdkApi } from "./apis/AiSdk.js";
export type { BaseLlmApi } from "./apis/base.js";
export type {
  AiSdkConfig,
  AskSageResponse,
  AskSageTokenResponse,
  AskSageTool,
  AskSageToolCall,
  AskSageToolChoice,
  LLMConfig,
} from "./types.js";

export {
  addCacheControlToLastTwoUserMessages,
  getAnthropicErrorMessage,
  getAnthropicHeaders,
  getAnthropicMediaTypeFromDataUrl,
} from "./apis/AnthropicUtils.js";

export { isResponsesModel } from "./apis/openaiResponses.js";
export { extractBase64FromDataUrl, parseDataUrl } from "./util/url.js";

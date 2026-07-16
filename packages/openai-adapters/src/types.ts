import * as z from "zod";

export const ClientCertificateOptionsSchema = z.object({
  cert: z.string(),
  key: z.string(),
  passphrase: z.string().optional(),
});

export const RequestOptionsSchema = z.object({
  timeout: z.number().optional(),
  verifySsl: z.boolean().optional(),
  caBundlePath: z.union([z.string(), z.array(z.string())]).optional(),
  proxy: z.string().optional(),
  headers: z.record(z.string()).optional(),
  extraBodyProperties: z.record(z.unknown()).optional(),
  noProxy: z.array(z.string()).optional(),
  clientCertificate: z.lazy(() => ClientCertificateOptionsSchema).optional(),
});

// Base config objects
export const BaseConfig = z.object({
  provider: z.string(),
  requestOptions: RequestOptionsSchema.optional(),
});

export const BasePlusConfig = BaseConfig.extend({
  apiBase: z.string().optional(),
  apiKey: z.string().optional(),
});

export const OpenAIConfigSchema = BasePlusConfig.extend({
  useResponsesApi: z.boolean().optional(),
  provider: z.union([z.literal("openai"), z.literal("zAI")]),
});
export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>;

export const DeepseekConfigSchema = OpenAIConfigSchema.extend({
  provider: z.literal("deepseek"),
});
export type DeepseekConfig = z.infer<typeof DeepseekConfigSchema>;

export const MiniMaxConfigSchema = OpenAIConfigSchema.extend({
  provider: z.literal("minimax"),
});
export type MiniMaxConfig = z.infer<typeof MiniMaxConfigSchema>;

export const MockConfigSchema = BasePlusConfig.extend({
  provider: z.literal("mock"),
});
export type MockConfig = z.infer<typeof MockConfigSchema>;

export const GeminiConfigSchema = OpenAIConfigSchema.extend({
  provider: z.literal("gemini"),
  apiKey: z.string(),
});
export type GeminiConfig = z.infer<typeof GeminiConfigSchema>;

export const AnthropicConfigSchema = OpenAIConfigSchema.extend({
  provider: z.literal("anthropic"),
  apiKey: z.string(),
});
export type AnthropicConfig = z.infer<typeof AnthropicConfigSchema>;

export const AiSdkConfigSchema = BasePlusConfig.extend({
  provider: z.literal("ai-sdk"),
  model: z.string(),
  providerOptions: z.record(z.unknown()).optional(),
});
export type AiSdkConfig = z.infer<typeof AiSdkConfigSchema>;

// Kept for type compatibility with removed AskSage adapter consumers
export interface AskSageTool {
  type: string;
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

export type AskSageToolChoice =
  | "auto"
  | "none"
  | { type: "function"; function: { name: string } };

export interface AskSageToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface AskSageResponse {
  text?: string;
  answer?: string;
  message?: string;
  status?: number | string;
  response?: unknown;
  tool_calls?: AskSageToolCall[];
  choices?: Array<{
    message?: {
      content?: string;
      tool_calls?: AskSageToolCall[];
    };
  }>;
}

export interface AskSageTokenResponse {
  status: number | string;
  response: {
    access_token: string;
  };
}

export const LLMConfigSchema = z.discriminatedUnion("provider", [
  OpenAIConfigSchema,
  DeepseekConfigSchema,
  MiniMaxConfigSchema,
  GeminiConfigSchema,
  AnthropicConfigSchema,
  MockConfigSchema,
  AiSdkConfigSchema,
]);
export type LLMConfig = z.infer<typeof LLMConfigSchema>;

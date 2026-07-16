import { HTMLInputTypeAttribute } from "react";
import { ModelProviderTags } from "../../../components/modelSelection/utils";
import { completionParamsInputs } from "./completionParamsInputs";
import type { ModelPackage } from "./models";
import { models } from "./models";

export interface InputDescriptor {
  inputType: HTMLInputTypeAttribute;
  key: string;
  label: string;
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  required?: boolean;
  description?: string;
  [key: string]: any;
}

export interface ProviderInfo {
  title: string;
  icon?: string;
  provider: string;
  description: string;
  longDescription?: string;
  tags?: ModelProviderTags[];
  packages: ModelPackage[];
  popularPackages?: ModelPackage[];
  params?: any;
  collectInputFor?: InputDescriptor[];
  refPage?: string;
  apiKeyUrl?: string;
  downloadUrl?: string;
}

const completionParamsInputsConfigs = Object.values(completionParamsInputs);

export const apiBaseInput: InputDescriptor = {
  inputType: "text",
  key: "apiBase",
  label: "API Base",
  placeholder: "e.g. https://api.example.com/v1/",
  required: false,
};

/** Kept for callers that still import this name; local Ollama provider is removed. */
export const ollamaStaticModels: ModelPackage[] = [];

export const providers: Partial<Record<string, ProviderInfo>> = {
  openai: {
    title: "OpenAI",
    provider: "openai",
    description: "Use gpt-5.4, gpt-5, or any other OpenAI model",
    longDescription:
      "Use gpt-5.4, gpt-5, or any other OpenAI model. See [here](https://openai.com/product#made-for-developers) to obtain an API key.",
    icon: "openai.png",
    tags: [ModelProviderTags.RequiresApiKey],
    packages: [
      models.gpt5_4Pro,
      models.gpt5_4,
      models.gpt5_4Mini,
      models.gpt5_2,
      models.gpt5_1,
      models.gpt5,
      models.gpt5Mini,
      models.gpt5Codex,
      models.gpt41,
      models.gpt41Mini,
      models.codexMini,
      models.o3,
      models.o4Mini,
      models.gpt4o,
      models.gpt4omini,
      models.gpt4turbo,
      models.gpt35turbo,
      {
        ...models.AUTODETECT,
        params: {
          ...models.AUTODETECT.params,
          title: "OpenAI",
        },
      },
    ],
    collectInputFor: [
      {
        inputType: "text",
        key: "apiKey",
        label: "API Key",
        placeholder: "Enter your OpenAI API key",
        required: true,
      },
      ...completionParamsInputsConfigs,
    ],
    apiKeyUrl: "https://platform.openai.com/account/api-keys",
  },
  anthropic: {
    title: "Anthropic",
    provider: "anthropic",
    refPage: "anthropicllm",
    description:
      "Anthropic builds state-of-the-art models with large context length and high recall",
    icon: "anthropic.png",
    tags: [ModelProviderTags.RequiresApiKey],
    longDescription:
      "To get started with Anthropic models, you first need to sign up for the open beta [here](https://claude.ai/login) to obtain an API key.",
    collectInputFor: [
      {
        inputType: "text",
        key: "apiKey",
        label: "API Key",
        placeholder: "Enter your Anthropic API key",
        required: true,
      },
      ...completionParamsInputsConfigs,
      {
        ...completionParamsInputs.contextLength,
        defaultValue: 100000,
      },
    ],
    packages: [
      models.claude46Opus,
      models.claude46Sonnet,
      models.claude4_5Opus,
      models.claude45Sonnet,
      models.claude45Haiku,
      models.claude41Opus,
      models.claude4Sonnet,
    ],
    apiKeyUrl: "https://console.anthropic.com/account/keys",
  },
  deepseek: {
    title: "DeepSeek",
    provider: "deepseek",
    icon: "deepseek.png",
    description:
      "DeepSeek provides cheap inference of its DeepSeek Coder v2 and other impressive open-source models.",
    longDescription:
      "To get started with DeepSeek, obtain an API key from their website [here](https://platform.deepseek.com/api_keys).",
    tags: [ModelProviderTags.RequiresApiKey, ModelProviderTags.OpenSource],
    collectInputFor: [
      {
        inputType: "text",
        key: "apiKey",
        label: "API Key",
        placeholder: "Enter your DeepSeek API key",
        required: true,
      },
    ],
    packages: [
      models.deepseekCoderApi,
      models.deepseekChatApi,
      models.deepseekReasonerApi,
    ],
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
  },
  gemini: {
    title: "Google Gemini",
    provider: "gemini",
    refPage: "geminiapi",
    description:
      "Try out Google's state-of-the-art Gemini model from their API.",
    longDescription: `To get started with Google Gemini API, obtain your API key from [here](https://ai.google.dev/tutorials/workspace_auth_quickstart) and paste it below.`,
    icon: "gemini.png",
    tags: [ModelProviderTags.RequiresApiKey],
    collectInputFor: [
      {
        inputType: "text",
        key: "apiKey",
        label: "API Key",
        placeholder: "Enter your Gemini API key",
        required: true,
      },
    ],
    packages: [
      models.gemini31ProPreview,
      models.gemini3FlashPreview,
      models.gemini31FlashLitePreview,
      models.gemini25Pro,
      models.gemini25Flash,
      models.gemini25FlashLite,
    ],
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
  },
  zAI: {
    title: "Z.ai",
    provider: "zAI",
    description: "Use Z.ai's GLM models for chat and coding tasks",
    longDescription:
      "Z.ai (formerly Zhipu AI) provides the GLM family of large language models. Get your API key from the [Z.ai platform](https://z.ai/manage-apikey/apikey-list).",
    icon: "zai.svg",
    tags: [ModelProviderTags.RequiresApiKey],
    packages: [models.glm5, models.glm47, models.glm45],
    collectInputFor: [
      {
        inputType: "text",
        key: "apiKey",
        label: "API Key",
        placeholder: "Enter your Z.ai API key",
        required: true,
      },
      ...completionParamsInputsConfigs,
    ],
    apiKeyUrl: "https://z.ai/manage-apikey/apikey-list",
  },
  minimax: {
    title: "MiniMax",
    provider: "minimax",
    description:
      "MiniMax offers high-performance models with 200K+ context windows at competitive pricing.",
    longDescription:
      "To get started with MiniMax, obtain an API key from the [MiniMax Platform](https://platform.minimax.io).",
    tags: [ModelProviderTags.RequiresApiKey],
    collectInputFor: [
      {
        inputType: "text",
        key: "apiKey",
        label: "API Key",
        placeholder: "Enter your MiniMax API key",
        required: true,
      },
    ],
    packages: [
      models.minimaxM27,
      models.minimaxM27Highspeed,
      models.minimaxM25,
      models.minimaxM25Highspeed,
      {
        ...models.AUTODETECT,
        params: {
          ...models.AUTODETECT.params,
          title: "MiniMax",
        },
      },
    ],
    apiKeyUrl: "https://platform.minimax.io",
  },
};

import Handlebars from "handlebars";
import {
  BaseCompletionOptions,
  IdeSettings,
  ILLM,
  ILLMLogger,
  JSONModelDescription,
  LLMOptions,
} from "../..";
import { renderTemplatedString } from "../../util/handlebars/renderTemplatedString";
import { BaseLLM } from "../index";
import Anthropic from "./Anthropic";
import Deepseek from "./Deepseek";
import Gemini from "./Gemini";
import MiniMax from "./MiniMax";
import MockLLM from "./Mock";
import OpenAI from "./OpenAI";
import TestLLM from "./Test";
import zAI from "./zAI";

export const LLMClasses = [
  Anthropic,
  Deepseek,
  Gemini,
  MiniMax,
  MockLLM,
  OpenAI,
  TestLLM,
  zAI,
];

export async function llmFromDescription(
  desc: JSONModelDescription,
  readFile: (filepath: string) => Promise<string>,
  getUriFromPath: (path: string) => Promise<string | undefined>,
  uniqueId: string,
  ideSettings: IdeSettings,
  llmLogger: ILLMLogger,
  completionOptions?: BaseCompletionOptions,
): Promise<BaseLLM | undefined> {
  const cls = LLMClasses.find((llm) => llm.providerName === desc.provider);

  if (!cls) {
    return undefined;
  }

  const finalCompletionOptions = {
    ...completionOptions,
    ...desc.completionOptions,
  };

  let baseChatSystemMessage: string | undefined = undefined;
  if (desc.systemMessage !== undefined) {
    baseChatSystemMessage = await renderTemplatedString(
      Handlebars,
      desc.systemMessage,
      {},
      [],
      readFile,
      getUriFromPath,
    );
  }

  let options: LLMOptions = {
    ...desc,
    completionOptions: {
      ...finalCompletionOptions,
      model: (desc.model || cls.defaultOptions?.model) ?? "codellama-7b",
      maxTokens:
        finalCompletionOptions.maxTokens ??
        cls.defaultOptions?.completionOptions?.maxTokens,
    },
    baseChatSystemMessage,
    basePlanSystemMessage: baseChatSystemMessage,
    baseAgentSystemMessage: baseChatSystemMessage,
    logger: llmLogger,
    uniqueId,
  };

  return new cls(options);
}

export function llmFromProviderAndOptions(
  providerName: string,
  llmOptions: LLMOptions,
): ILLM {
  const cls = LLMClasses.find((llm) => llm.providerName === providerName);

  if (!cls) {
    throw new Error(`Unknown LLM provider type "${providerName}"`);
  }

  return new cls(llmOptions);
}

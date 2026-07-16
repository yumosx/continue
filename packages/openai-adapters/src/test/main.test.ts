import { ModelConfig } from "@continuedev/config-yaml";
import * as dotenv from "dotenv";
import { vi } from "vitest";
import { DEEPSEEK_API_BASE } from "../apis/DeepSeek.js";
import { OpenAIApi } from "../apis/OpenAI.js";
import { constructLlmApi } from "../index.js";
import { getLlmApi, testChat, testEmbed, testFim, testRerank } from "./util.js";

dotenv.config();

export interface TestConfigOptions {
  skipTools: boolean;
  expectUsage?: boolean;
  skipSystemMessage?: boolean;
}

function testConfig(_config: ModelConfig & { options?: TestConfigOptions }) {
  const { options, ...config } = _config;
  const model = config.model;
  const api = getLlmApi({
    provider: config.provider as any,
    apiKey: config.apiKey,
    apiBase: config.apiBase,
  });

  if (
    ["chat", "summarize", "edit", "apply"].some((role) =>
      config.roles?.includes(role as any),
    )
  ) {
    testChat(api, model, options);
  }

  if (config.roles?.includes("embed")) {
    testEmbed(api, model);
  }

  if (config.roles?.includes("rerank")) {
    testRerank(api, model);
  }

  if (config.roles?.includes("autocomplete")) {
    testFim(api, model);
  }
}

const TESTS: Omit<ModelConfig & { options?: TestConfigOptions }, "name">[] = [
  {
    provider: "openai",
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY!,
    roles: ["chat"],
    options: {
      skipTools: false,
      expectUsage: true,
    },
  },
  {
    provider: "openai",
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY!,
    roles: ["chat"],
    options: {
      skipTools: false,
      expectUsage: true,
    },
  },
  {
    provider: "anthropic",
    model: "claude-haiku-4-5",
    apiKey: process.env.ANTHROPIC_API_KEY!,
    roles: ["chat"],
    options: {
      skipTools: false,
      expectUsage: true,
    },
  },
  {
    provider: "gemini",
    model: "gemini-2.5-pro",
    apiKey: process.env.GEMINI_API_KEY!,
    roles: ["chat"],
    options: {
      skipTools: false,
      expectUsage: true,
    },
  },
  {
    provider: "gemini",
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY!,
    roles: ["chat"],
    options: {
      skipTools: false,
      expectUsage: true,
    },
  },
  {
    provider: "openai",
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY!,
    roles: ["embed"],
  },
];

if (process.env.IGNORE_API_KEY_TESTS === "true") {
  test("Skipping API key tests", () => {
    console.log("Skipping API key tests due to IGNORE_API_KEY_TESTS being set");
  });
} else {
  TESTS.forEach((config) => {
    if (!config.apiKey) {
      return;
    }
    describe(`${config.provider}/${config.model}`, () => {
      vi.setConfig({ testTimeout: 30000 });
      testConfig({ name: config.model, ...config });
    });
  });
}

describe("Configuration", () => {
  it("should configure DeepSeek OpenAI client with correct apiBase and apiKey", () => {
    const deepseek = constructLlmApi({
      provider: "deepseek",
      apiKey: "sk-xxx",
    });

    expect((deepseek as OpenAIApi).openai.baseURL).toBe(DEEPSEEK_API_BASE);
    expect((deepseek as OpenAIApi).openai.apiKey).toBe("sk-xxx");

    const deepseek2 = constructLlmApi({
      provider: "deepseek",
      apiKey: "sk-xxx",
      apiBase: "https://api.example.com",
    });
    expect((deepseek2 as OpenAIApi).openai.baseURL).toBe(
      "https://api.example.com",
    );
  });

  it("should configure zAI OpenAI client with correct default apiBase", () => {
    const zai = constructLlmApi({
      provider: "zAI",
      apiKey: "sk-xxx",
    });

    expect((zai as OpenAIApi).openai.baseURL).toBe(
      "https://api.z.ai/api/paas/v4/",
    );
    expect((zai as OpenAIApi).openai.apiKey).toBe("sk-xxx");
  });
});

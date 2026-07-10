import { AssistantUnrolled, ModelConfig } from "@continuedev/config-yaml";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../config.js");
vi.mock("../util/modelPersistence.js");

import * as config from "../config.js";
import * as modelPersistence from "../util/modelPersistence.js";

import { ModelService } from "./ModelService.js";

describe("ModelService", () => {
  let service: ModelService;
  let mockAssistant: AssistantUnrolled;
  const mockLlmApi = { complete: vi.fn(), stream: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ModelService();

    mockAssistant = {
      name: "test-assistant",
      version: "1.0.0",
      models: [
        {
          provider: "openai",
          model: "gpt-4",
          name: "GPT-4",
          apiKey: "test-key",
          roles: ["chat"],
        } as ModelConfig,
        {
          provider: "anthropic",
          model: "claude-3",
          name: "Claude 3",
          apiKey: "test-key",
          roles: ["chat"],
        } as ModelConfig,
        {
          provider: "openai",
          model: "gpt-3.5",
          name: "GPT-3.5",
          apiKey: "test-key",
          roles: ["embed"],
        } as ModelConfig,
      ],
    } as AssistantUnrolled;
  });

  describe("State Management", () => {
    test("should initialize with default model", async () => {
      vi.mocked(config.getLlmApi).mockReturnValue([
        mockLlmApi as any,
        mockAssistant.models![0] as ModelConfig,
      ]);
      vi.mocked(modelPersistence.getPersistedModelName).mockReturnValue(null);

      const state = await service.initialize(mockAssistant, undefined);

      expect(state).toEqual({
        llmApi: mockLlmApi,
        model: mockAssistant.models![0],
        assistant: mockAssistant,
      });
    });

    test("should initialize with persisted model if valid", async () => {
      vi.mocked(modelPersistence.getPersistedModelName).mockReturnValue(
        "Claude 3",
      );
      vi.mocked(config.createLlmApi).mockReturnValue(mockLlmApi as any);

      const state = await service.initialize(mockAssistant, undefined);

      expect(state.model?.name).toBe("Claude 3");
      expect(state.llmApi).toStrictEqual(mockLlmApi);
    });

    test("should fall back to default if persisted model not found", async () => {
      vi.mocked(modelPersistence.getPersistedModelName).mockReturnValue(
        "Non-existent Model",
      );
      vi.mocked(config.getLlmApi).mockReturnValue([
        mockLlmApi as any,
        mockAssistant.models![0] as ModelConfig,
      ]);

      const state = await service.initialize(mockAssistant, undefined);

      expect(state.model).toBe(mockAssistant.models![0]);
    });
  });

  describe("switchModel()", () => {
    test("should switch to a different model by index", async () => {
      vi.mocked(config.getLlmApi).mockReturnValue([
        mockLlmApi as any,
        mockAssistant.models![0] as ModelConfig,
      ]);
      vi.mocked(modelPersistence.getPersistedModelName).mockReturnValue(null);
      await service.initialize(mockAssistant, undefined);

      vi.mocked(config.createLlmApi).mockReturnValue(mockLlmApi as any);
      const state = await service.switchModel(1);

      expect(state.model?.name).toBe("Claude 3");
      expect(state.llmApi).toBe(mockLlmApi);
    });
  });

  describe("getDependencies()", () => {
    test("should depend on config and agentFile services", () => {
      expect(service.getDependencies()).toEqual(["config", "agentFile"]);
    });
  });
});

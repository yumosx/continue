import Anthropic from "../Anthropic.js";
import Deepseek from "../Deepseek.js";
import Gemini from "../Gemini.js";
import MiniMax from "../MiniMax.js";
import OpenAI from "../OpenAI.js";
import zAI from "../zAI.js";

// Test cases: [LLM class, model, expected supportsFim result, description]
const testCases: [any, string, boolean, string][] = [
  [Anthropic, "claude-3-5-sonnet-latest", false, "Anthropic"],
  [OpenAI, "codestral", false, "OpenAI"],
  [Deepseek, "deepseek-chat", true, "Deepseek"],
  [Gemini, "gemini-2.5-flash", false, "Gemini"],
  [MiniMax, "MiniMax-M2.7", false, "MiniMax"],
  [zAI, "glm-4.5", false, "zAI"],
];

testCases.forEach(([LLMClass, model, expectedResult, description]) => {
  test(`supportsFim returns ${expectedResult} for ${description}`, () => {
    const llm = new LLMClass({
      model,
      apiKey: "test-key",
    });

    const result = llm.supportsFim();

    expect(result).toBe(expectedResult);
  });
});

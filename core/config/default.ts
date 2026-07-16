import { ConfigYaml } from "@continuedev/config-yaml";

export const defaultConfig: ConfigYaml = {
  name: "Main Config",
  version: "1.0.0",
  schema: "v1",
  models: [
    {
      name: "DeepSeek V4 Pro",
      provider: "deepseek",
      model: "deepseek-v4-pro",
      apiKey: "${{ secrets.DEEPSEEK_API_KEY }}",
      apiBase: "https://api.deepseek.com/",
      roles: ["chat", "edit", "apply"],
      capabilities: ["tool_use"],
      requestOptions: {
        extraBodyProperties: {
          thinking: { type: "enabled" },
          reasoning_effort: "high",
        },
      },
    },
  ],
};

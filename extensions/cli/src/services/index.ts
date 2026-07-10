import { HookService } from "../hooks/HookService.js";
import { initializeWithOnboarding } from "../onboarding.js";
import {
  setBetaSubagentToolEnabled,
  setBetaUploadArtifactToolEnabled,
} from "../tools/toolsConfig.js";
import { logger } from "../util/logger.js";

import { AgentFileService } from "./AgentFileService.js";
import { ApiClientService } from "./ApiClientService.js";
import { ArtifactUploadService } from "./ArtifactUploadService.js";
import { backgroundJobService } from "./BackgroundJobService.js";
import { ChatHistoryService } from "./ChatHistoryService.js";
import { ConfigService } from "./ConfigService.js";
import { FileIndexService } from "./FileIndexService.js";
import { GitAiIntegrationService } from "./GitAiIntegrationService.js";
import { MCPService } from "./MCPService.js";
import { ModelService } from "./ModelService.js";
import { quizService } from "./QuizService.js";
import { ResourceMonitoringService } from "./ResourceMonitoringService.js";
import { serviceContainer } from "./ServiceContainer.js";
import { StorageSyncService } from "./StorageSyncService.js";
import { SystemMessageService } from "./SystemMessageService.js";
import {
  InitializeToolServiceOverrides,
  ToolPermissionService,
} from "./ToolPermissionService.js";
import {
  AgentFileServiceState,
  ApiClientServiceState,
  ConfigServiceState,
  MCPServiceState,
  SERVICE_NAMES,
  ServiceInitOptions,
} from "./types.js";
import { UpdateService } from "./UpdateService.js";

const configService = new ConfigService();
const modelService = new ModelService();
const apiClientService = new ApiClientService();
const mcpService = new MCPService();
const fileIndexService = new FileIndexService();
const resourceMonitoringService = new ResourceMonitoringService();
const chatHistoryService = new ChatHistoryService();
const updateService = new UpdateService();
const storageSyncService = new StorageSyncService();
const agentFileService = new AgentFileService();
const toolPermissionService = new ToolPermissionService();
const systemMessageService = new SystemMessageService();
const artifactUploadService = new ArtifactUploadService();
const gitAiIntegrationService = new GitAiIntegrationService();
const hookService = new HookService();

/**
 * Initialize all services and register them with the service container
 * Handles onboarding internally for TUI mode unless skipOnboarding is true
 */
export async function initializeServices(initOptions: ServiceInitOptions = {}) {
  logger.debug("Initializing service registry");

  const commandOptions = initOptions.options || {};

  if (commandOptions.betaUploadArtifactTool) {
    setBetaUploadArtifactToolEnabled(true);
  }
  if (commandOptions.betaSubagentTool) {
    setBetaSubagentToolEnabled(true);
  }

  if (!initOptions.headless && !initOptions.skipOnboarding) {
    await initializeWithOnboarding(commandOptions.config);
  }

  if (
    initOptions.headless &&
    !commandOptions.config &&
    process.env.ANTHROPIC_API_KEY
  ) {
    const { createOrUpdateConfig } = await import("../onboarding.js");
    const { env } = await import("../env.js");
    const path = await import("path");

    const CONFIG_PATH = path.join(env.continueHome, "config.yaml");
    await createOrUpdateConfig(process.env.ANTHROPIC_API_KEY);
    commandOptions.config = CONFIG_PATH;
  }

  serviceContainer.register(
    SERVICE_NAMES.API_CLIENT,
    async () => apiClientService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.AGENT_FILE,
    async () => {
      const apiClientState = await serviceContainer.get<ApiClientServiceState>(
        SERVICE_NAMES.API_CLIENT,
      );

      return await agentFileService.initialize(
        commandOptions.agent,
        apiClientState,
      );
    },
    [SERVICE_NAMES.API_CLIENT],
  );

  serviceContainer.register(
    SERVICE_NAMES.TOOL_PERMISSIONS,
    async () => {
      const [mcpState, agentFileState] = await Promise.all([
        serviceContainer.get<MCPServiceState>(SERVICE_NAMES.MCP),
        serviceContainer.get<AgentFileServiceState>(SERVICE_NAMES.AGENT_FILE),
      ]);

      if (initOptions.toolPermissionOverrides) {
        const overrides = { ...initOptions.toolPermissionOverrides };
        const initArgs: InitializeToolServiceOverrides = {
          allow: overrides.allow,
          ask: overrides.ask,
          exclude: overrides.exclude,
          isHeadless: initOptions.headless,
        };
        if (overrides.mode) {
          initArgs.mode = overrides.mode;
        }
        return await toolPermissionService.initialize(
          initArgs,
          agentFileState,
          mcpState,
        );
      }

      return await toolPermissionService.initialize(
        {
          isHeadless: initOptions.headless,
        },
        agentFileState,
        mcpState,
      );
    },
    [SERVICE_NAMES.AGENT_FILE, SERVICE_NAMES.MCP],
  );

  serviceContainer.register(
    SERVICE_NAMES.SYSTEM_MESSAGE,
    () =>
      systemMessageService.initialize({
        additionalRules: commandOptions.rule,
        format: (commandOptions as any).format,
        headless: initOptions.headless,
      }),
    [SERVICE_NAMES.TOOL_PERMISSIONS],
  );

  serviceContainer.register(
    SERVICE_NAMES.UPDATE,
    () => updateService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.CONFIG,
    async () => {
      const [apiClientState, agentFileState] = await Promise.all([
        serviceContainer.get<ApiClientServiceState>(SERVICE_NAMES.API_CLIENT),
        serviceContainer.get<AgentFileServiceState>(SERVICE_NAMES.AGENT_FILE),
      ]);

      if (!apiClientState.apiClient) {
        throw new Error("API client not available");
      }

      const currentState = configService.getState();
      const configPath =
        commandOptions.config ||
        (currentState.configPath === undefined
          ? undefined
          : currentState.configPath);

      return await configService.initialize({
        configPath,
        apiClient: apiClientState.apiClient,
        agentFileState,
        injectedConfigOptions: commandOptions,
        isHeadless: initOptions.headless,
      });
    },
    [SERVICE_NAMES.API_CLIENT, SERVICE_NAMES.AGENT_FILE],
  );

  serviceContainer.register(
    SERVICE_NAMES.MODEL,
    async () => {
      const [configState, agentFileState] = await Promise.all([
        serviceContainer.get<ConfigServiceState>(SERVICE_NAMES.CONFIG),
        serviceContainer.get<AgentFileServiceState>(SERVICE_NAMES.AGENT_FILE),
      ]);

      if (!configState.config) {
        throw new Error("Config not available");
      }

      return modelService.initialize(configState.config, agentFileState);
    },
    [SERVICE_NAMES.CONFIG, SERVICE_NAMES.AGENT_FILE],
  );

  serviceContainer.register(
    SERVICE_NAMES.MCP,
    async () => {
      const configState = await serviceContainer.get<ConfigServiceState>(
        SERVICE_NAMES.CONFIG,
      );

      if (!configState.config) {
        throw new Error("Config not available for MCP service");
      }
      return mcpService.initialize(
        configState.config,
        !!initOptions.options?.agent,
        initOptions.headless,
      );
    },
    [SERVICE_NAMES.CONFIG],
  );

  serviceContainer.register(
    SERVICE_NAMES.FILE_INDEX,
    () => fileIndexService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.RESOURCE_MONITORING,
    () => resourceMonitoringService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.STORAGE_SYNC,
    () => storageSyncService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.ARTIFACT_UPLOAD,
    () => artifactUploadService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.CHAT_HISTORY,
    () => chatHistoryService.initialize(undefined, initOptions.headless),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.GIT_AI_INTEGRATION,
    () => gitAiIntegrationService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.QUIZ,
    () => quizService.initialize(),
    [],
  );

  serviceContainer.register(
    SERVICE_NAMES.HOOKS,
    () => hookService.initialize(),
    [],
  );

  await serviceContainer.initializeAll();

  logger.debug("Service registry initialized");
}

export function getService<T>(serviceName: string): Promise<T> {
  return serviceContainer.get<T>(serviceName);
}

export function getServiceSync<T>(serviceName: string) {
  return serviceContainer.getSync<T>(serviceName);
}

export function reloadService(serviceName: string) {
  return serviceContainer.reload(serviceName);
}

export function areServicesReady(): boolean {
  return Object.values(SERVICE_NAMES).every((name) =>
    serviceContainer.isReady(name),
  );
}

export function getServiceStates() {
  return serviceContainer.getServiceStates();
}

export const services = {
  config: configService,
  model: modelService,
  apiClient: apiClientService,
  mcp: mcpService,
  fileIndex: fileIndexService,
  resourceMonitoring: resourceMonitoringService,
  systemMessage: systemMessageService,
  chatHistory: chatHistoryService,
  updateService: updateService,
  storageSync: storageSyncService,
  agentFile: agentFileService,
  toolPermissions: toolPermissionService,
  artifactUpload: artifactUploadService,
  gitAiIntegration: gitAiIntegrationService,
  backgroundJobs: backgroundJobService,
  quiz: quizService,
  hooks: hookService,
} as const;

export type ServicesType = typeof services;

export { serviceContainer };

export type * from "./types.js";
export { SERVICE_NAMES } from "./types.js";

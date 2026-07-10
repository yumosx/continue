import { DefaultApiInterface } from "@continuedev/sdk/dist/api/dist/index.js";

import { BaseService, ServiceWithDependencies } from "./BaseService.js";
import { ApiClientServiceState } from "./types.js";

/**
 * Service for managing API client state.
 * Provides access to the Continue SDK API client.
 */
export class ApiClientService
  extends BaseService<ApiClientServiceState>
  implements ServiceWithDependencies
{
  constructor() {
    super("ApiClientService", {
      apiClient: null,
    });
  }

  getDependencies(): string[] {
    return [];
  }

  async doInitialize(): Promise<ApiClientServiceState> {
    const { getApiClient } = await import("../config.js");
    return {
      apiClient: getApiClient(undefined),
    };
  }

  async update(): Promise<ApiClientServiceState> {
    const { getApiClient } = await import("../config.js");
    const { logger } = await import("../util/logger.js");

    logger.debug("Updating ApiClientService");

    try {
      const apiClient = getApiClient(undefined);

      this.setState({
        apiClient,
      });

      logger.debug("ApiClientService updated successfully");
      return this.getState();
    } catch (error: any) {
      logger.error("Failed to update ApiClientService:", error);
      this.emit("error", error);
      throw error;
    }
  }

  override isReady(): boolean {
    return super.isReady() && this.currentState.apiClient !== null;
  }
}

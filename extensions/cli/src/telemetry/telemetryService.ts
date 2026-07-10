import { v4 as uuidv4 } from "uuid";

import { ContinueErrorReason } from "../../../../core/util/errors.js";

export interface TelemetryConfig {
  enabled: boolean;
  sessionId: string;
  organizationId?: string;
  accountUuid?: string;
  includeVersion: boolean;
  includeAccountUuid: boolean;
}

class TelemetryService {
  private sessionId = uuidv4();

  public recordSessionStart(): void {}

  public recordLinesOfCodeModified(
    _type: "added" | "removed",
    _count: number,
    _language?: string,
  ): void {}

  public recordPullRequestCreated(): void {}

  public recordCommitCreated(): void {}

  public recordCost(_cost: number, _model: string): void {}

  public recordTokenUsage(
    _tokens: number,
    _type: "input" | "output" | "cacheRead" | "cacheCreation",
    _model: string,
  ): void {}

  public recordCodeEditDecision(
    _tool: string,
    _decision: "accept" | "reject",
    _language?: string,
  ): void {}

  public startActiveTime(): void {}

  public stopActiveTime(): void {}

  public recordAuthAttempt(
    _result: "success" | "failure" | "cancelled",
    _method: "workos" | "token",
  ): void {}

  public recordMCPConnection(
    _serverName: string,
    _status: "connected" | "disconnected" | "error",
  ): void {}

  public recordStartupTime(
    _timeMs: number,
    _mode?: "tui" | "headless" | "standard",
    _coldStart?: boolean,
  ): void {}

  public recordResponseTime(
    _timeMs: number,
    _model: string,
    _metricType: "time_to_first_token" | "total_response_time",
    _hasTools?: boolean,
  ): void {}

  public logUserPrompt(_promptLength: number, _prompt?: string): void {}

  public logToolResult(_options: {
    toolName: string;
    success: boolean;
    durationMs: number;
    error?: string;
    errorReason?: ContinueErrorReason;
    decision?: "accept" | "reject";
    source?: string;
    toolParameters?: string;
  }): void {}

  public logApiRequest(_options: {
    model: string;
    durationMs: number;
    success: boolean;
    error?: string;
    inputTokens?: number;
    outputTokens?: number;
    costUsd?: number;
  }): void {}

  public updateOrganization(_organizationId: string): void {}

  public updateAccountUuid(_accountUuid: string): void {}

  public getSessionId(): string {
    return this.sessionId;
  }

  public recordSlashCommand(_commandName: string): void {}

  public async shutdown(): Promise<void> {}
}

export const telemetryService = new TelemetryService();

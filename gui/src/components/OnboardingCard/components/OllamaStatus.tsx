import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { OllamaConnectionStatuses } from "../utils";
import OllamaCompletedStep from "./OllamaCompletedStep";

interface OllamaStatusProps {
  isOllamaConnected: boolean;
}

/** Local Ollama onboarding UI — provider removed; show connection status only. */
export function OllamaStatus({ isOllamaConnected }: OllamaStatusProps) {
  const [status, setStatus] = useState<OllamaConnectionStatuses>(
    OllamaConnectionStatuses.WaitingToDownload,
  );

  useEffect(() => {
    if (isOllamaConnected) {
      setStatus(OllamaConnectionStatuses.Connected);
    } else {
      setStatus(OllamaConnectionStatuses.WaitingToDownload);
    }
  }, [isOllamaConnected]);

  switch (status) {
    case OllamaConnectionStatuses.Connected:
      return <OllamaCompletedStep text="Ollama is running" />;
    default:
      return (
        <div className="flex flex-row items-center gap-2 text-sm">
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
          <span>Local Ollama provider is not available in this build</span>
        </div>
      );
  }
}

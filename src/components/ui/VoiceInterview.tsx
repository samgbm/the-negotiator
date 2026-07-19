"use client";

import { useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Loader2, Mic, MicOff } from "lucide-react";

function VoiceInterviewPanel() {
  const conversation = useConversation();
  const [permissionError, setPermissionError] = useState<string | null>(null);

  async function startConversation() {
    setPermissionError(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
      });
    } catch (error) {
      setPermissionError(
        error instanceof Error
          ? error.message
          : "Microphone permission is required to start the AI clarification call.",
      );
    }
  }

  function endConversation() {
    conversation.endSession();
  }

  const { status, isSpeaking, isListening } = conversation;

  let statusLabel = "Ready to clarify your move details";
  if (status === "connecting") {
    statusLabel = "Connecting to agent...";
  } else if (status === "connected" && isSpeaking) {
    statusLabel = "Agent is speaking...";
  } else if (status === "connected" && isListening) {
    statusLabel = "Agent is listening...";
  } else if (status === "connected") {
    statusLabel = "Agent is listening...";
  } else if (status === "error") {
    statusLabel = conversation.message ?? "Connection error. Please try again.";
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="text-sm text-accent" role="status" aria-live="polite">
        {statusLabel}
      </p>

      {status === "connecting" ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="size-10 animate-spin text-primary"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-foreground">Connecting...</p>
        </div>
      ) : null}

      {status === "disconnected" || status === "error" ? (
        <button
          type="button"
          onClick={startConversation}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Mic className="size-4" aria-hidden="true" />
          Start AI Clarification
        </button>
      ) : null}

      {status === "connected" ? (
        <div className="relative flex items-center justify-center">
          <span
            className="absolute inline-flex size-16 animate-ping rounded-full bg-primary/30"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={endConversation}
            className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="End AI clarification call"
          >
            <MicOff className="size-4" aria-hidden="true" />
            End Call
          </button>
        </div>
      ) : null}

      {permissionError ? (
        <p className="text-sm text-primary">{permissionError}</p>
      ) : null}
    </div>
  );
}

export function VoiceInterview() {
  return (
    <ConversationProvider>
      <VoiceInterviewPanel />
    </ConversationProvider>
  );
}

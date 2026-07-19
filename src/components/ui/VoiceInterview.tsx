"use client";

import { useState, useTransition } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Loader2, Mic, MicOff } from "lucide-react";
import { finalizeJobSpecAction } from "@/actions/finalizeSpec";
import { FinalSpecCard } from "@/components/ui/FinalSpecCard";
import type { JobSpecRecord } from "@/lib/final-job-spec";
import type { JobSpec } from "@/lib/job-spec";

const MOCK_VOICE_SUMMARY = "User stated there are 2 flights of stairs";

type VoiceInterviewProps = {
  jobSpec: JobSpec;
  isDemoMode: boolean;
};

function VoiceInterviewPanel({ jobSpec, isDemoMode }: VoiceInterviewProps) {
  const conversation = useConversation();
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [finalRecord, setFinalRecord] = useState<JobSpecRecord | null>(null);
  const [isPending, startTransition] = useTransition();

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

  function handleEndCallAndFinalize() {
    if (conversation.status === "connected") {
      conversation.endSession();
    }

    setFinalizeError(null);

    startTransition(async () => {
      const result = await finalizeJobSpecAction(
        jobSpec,
        MOCK_VOICE_SUMMARY,
        isDemoMode,
      );

      if (result.success) {
        setFinalRecord(result.data);
      } else {
        setFinalizeError(result.error);
      }
    });
  }

  if (finalRecord) {
    return <FinalSpecCard record={finalRecord} />;
  }

  if (isPending) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/20 px-6 py-10"
        role="status"
        aria-live="polite"
      >
        <Loader2
          className="size-8 animate-spin text-primary"
          aria-hidden="true"
        />
        <p className="animate-pulse text-sm font-medium text-foreground">
          Compiling Immutable Job Spec...
        </p>
      </div>
    );
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

      <button
        type="button"
        onClick={handleEndCallAndFinalize}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        End Call & Finalize
      </button>

      {permissionError ? (
        <p className="text-sm text-primary">{permissionError}</p>
      ) : null}
      {finalizeError ? (
        <p className="text-sm text-primary">{finalizeError}</p>
      ) : null}
    </div>
  );
}

export function VoiceInterview({ jobSpec, isDemoMode }: VoiceInterviewProps) {
  return (
    <ConversationProvider>
      <VoiceInterviewPanel jobSpec={jobSpec} isDemoMode={isDemoMode} />
    </ConversationProvider>
  );
}

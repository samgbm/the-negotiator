import type { ReactNode } from "react";

export function ConversationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useConversation() {
  return {
    status: "disconnected" as const,
    message: undefined,
    isSpeaking: false,
    isListening: false,
    startSession: jest.fn(),
    endSession: jest.fn(),
  };
}

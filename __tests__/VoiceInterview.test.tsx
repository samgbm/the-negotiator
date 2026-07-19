import { render, screen } from "@testing-library/react";
import { VoiceInterview } from "@/components/ui/VoiceInterview";
import { DEMO_JOB_SPEC } from "@/lib/job-spec";

jest.mock("@elevenlabs/react", () => ({
  ConversationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useConversation: () => ({
    status: "disconnected",
    message: undefined,
    isSpeaking: false,
    isListening: false,
    startSession: jest.fn(),
    endSession: jest.fn(),
  }),
}));

describe("VoiceInterview", () => {
  it("renders the Start AI Clarification button without hydration errors", () => {
    expect(() =>
      render(
        <VoiceInterview jobSpec={DEMO_JOB_SPEC} isDemoMode />,
      ),
    ).not.toThrow();

    expect(
      screen.getByRole("button", { name: /start ai clarification/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /end call & finalize/i }),
    ).toBeInTheDocument();
  });
});

"use client";

import { useState } from "react";
import { FileUploadZone } from "@/components/ui/FileUploadZone";
import { VoiceInterview } from "@/components/ui/VoiceInterview";
import type { JobSpec } from "@/lib/job-spec";

export function DocumentIntake() {
  const [jobSpec, setJobSpec] = useState<JobSpec | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <FileUploadZone
        onJobSpecChange={setJobSpec}
        isDemoMode={isDemoMode}
        onDemoModeChange={setIsDemoMode}
      />

      {jobSpec ? (
        <section className="mt-8 w-full rounded-xl border border-border bg-card p-6 text-left shadow-sm">
          <h2 className="mb-4 text-center text-xl font-semibold tracking-tight text-foreground">
            Step 2: Clarify Details with AI
          </h2>
          <p className="mb-6 text-center text-sm text-accent">
            Confirm stairs, access notes, and inventory gaps before we call
            vendors.
          </p>
          <VoiceInterview jobSpec={jobSpec} isDemoMode={isDemoMode} />
        </section>
      ) : null}
    </div>
  );
}

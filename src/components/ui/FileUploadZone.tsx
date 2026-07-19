"use client";

import {
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { extractJobSpecAction } from "@/actions/extract";
import type { JobSpec } from "@/lib/job-spec";

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function isAcceptedFile(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

type FileUploadZoneProps = {
  onJobSpecChange?: (jobSpec: JobSpec | null) => void;
};

export function FileUploadZone({ onJobSpecChange }: FileUploadZoneProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [jobSpec, setJobSpec] = useState<JobSpec | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateJobSpec(next: JobSpec | null) {
    setJobSpec(next);
    onJobSpecChange?.(next);
  }

  function runExtraction(selectedFile: File) {
    if (selectedFile.size > MAX_FILE_BYTES) {
      setError("File is too large. Please upload a document under 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    updateJobSpec(null);
    setError(null);

    startTransition(async () => {
      try {
        const result = await extractJobSpecAction(formData, isDemoMode);
        if (result.success) {
          updateJobSpec(result.data);
        } else {
          setError(result.error.message);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unexpected error while extracting. Please try again.",
        );
      }
    });
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const dropped = event.dataTransfer.files?.[0];
    if (dropped && isAcceptedFile(dropped)) {
      setFile(dropped);
      runExtraction(dropped);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected && isAcceptedFile(selected)) {
      setFile(selected);
      runExtraction(selected);
    }
  }

  function handleRemove() {
    setFile(null);
    updateJobSpec(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-end">
        <label
          className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2"
          title="Bypass APIs for instant stage demo"
        >
          <div className="text-right">
            <span className="block text-sm font-medium text-foreground">
              Demo Mode
            </span>
            <span className="block text-xs text-accent">
              Bypass APIs for instant stage demo
            </span>
          </div>
          <input
            type="checkbox"
            checked={isDemoMode}
            onChange={(event) => setIsDemoMode(event.target.checked)}
            className="peer sr-only"
            aria-label="Demo Mode"
          />
          <span
            aria-hidden="true"
            className="relative h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-transform peer-checked:after:translate-x-5"
          />
        </label>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/10 text-foreground"
            : "border-border bg-secondary/50 text-foreground"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
          onClick={(event) => event.stopPropagation()}
        />

        {file ? (
          <FileText className="size-10 text-primary" aria-hidden="true" />
        ) : (
          <UploadCloud className="size-10 text-accent" aria-hidden="true" />
        )}

        <div className="space-y-1">
          <p className="text-base font-medium">
            Drag and drop your inventory PDF
          </p>
          <p className="text-sm text-accent">
            or click to browse · PDF, DOC, DOCX, TXT
          </p>
        </div>
      </div>

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="truncate text-sm text-foreground">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 text-sm font-medium text-accent transition-colors hover:text-primary"
          >
            Remove
          </button>
        </div>
      ) : null}

      {isPending ? (
        <div
          className="flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-6 text-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2
            className="size-5 animate-spin text-primary"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">
            Extracting structured data using AI...
          </p>
        </div>
      ) : null}

      {error && !isPending ? (
        <p className="rounded-lg border border-border bg-secondary/20 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      ) : null}

      {jobSpec && !isPending ? (
        <div className="space-y-4 text-left">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Title
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {jobSpec.title}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Stairs
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {jobSpec.has_stairs ? "Yes — stair carry required" : "No stairs"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Origin
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {jobSpec.origin_address}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Destination
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {jobSpec.destination_address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-primary">
              Inventory
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {jobSpec.inventory.map((item) => (
                <div
                  key={`${item.item_name}-${item.category}`}
                  className="rounded-xl border border-border bg-secondary/20 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {item.item_name}
                  </p>
                  <p className="mt-1 text-xs text-accent">
                    Qty {item.quantity} · {item.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

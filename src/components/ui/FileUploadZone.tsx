"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, UploadCloud } from "lucide-react";

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

function isAcceptedFile(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function FileUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected && isAcceptedFile(selected)) {
      setFile(selected);
    }
  }

  function handleRemove() {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full">
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
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
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
    </div>
  );
}

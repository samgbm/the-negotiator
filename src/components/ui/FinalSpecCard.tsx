"use client";

import { CheckCircle } from "lucide-react";
import type { JobSpecRecord } from "@/lib/final-job-spec";

type FinalSpecCardProps = {
  record: JobSpecRecord;
};

export function FinalSpecCard({ record }: FinalSpecCardProps) {
  const inventory = Array.isArray(record.inventory_json)
    ? record.inventory_json
    : [];

  return (
    <article className="w-full rounded-xl border border-border bg-card p-6 shadow-lg">
      <header className="mb-5 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <CheckCircle className="size-6 text-green-500" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-foreground">
            Ground Truth Verified
          </h3>
        </div>
        <p className="font-mono text-xs text-accent break-all">
          DB ID: {record.id}
        </p>
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Title
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">
            {record.title}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Access Flags
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            Stairs: {record.has_stairs ? "Yes" : "No"} · Long Carry:{" "}
            {record.long_carry ? "Yes" : "No"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Origin
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {record.origin_address}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Destination
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {record.destination_address}
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-primary">
          Final Inventory
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {inventory.map((item) => (
            <div
              key={`${item.item_name}-${item.quantity}`}
              className="rounded-lg border border-border bg-secondary/20 p-4"
            >
              <p className="text-sm font-semibold text-foreground">
                {item.item_name}
              </p>
              <p className="mt-1 text-xs text-accent">Qty {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

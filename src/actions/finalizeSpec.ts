"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { FinalJobSpecSchema, type JobSpecRecord } from "@/lib/final-job-spec";
import { logger } from "@/lib/logger";
import { createClient } from "@/utils/supabase/server";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
});

function getOpenAIClient() {
  const env = envSchema.parse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

function toInventoryJson(initialSpec: unknown) {
  const spec = initialSpec as {
    inventory?: Array<{ item_name?: string; quantity?: number }>;
    inventory_json?: Array<{ item_name?: string; quantity?: number }>;
  };

  const source = spec.inventory_json ?? spec.inventory ?? [];

  return source.map((item) => ({
    item_name: String(item.item_name ?? "Unknown item"),
    quantity: Number(item.quantity ?? 1),
  }));
}

function buildDemoFinalSpec(initialSpec: any) {
  const base = initialSpec ?? {};

  return FinalJobSpecSchema.parse({
    title: String(base.title ?? "Untitled Move"),
    origin_address: String(base.origin_address ?? ""),
    destination_address: String(base.destination_address ?? ""),
    inventory_json: toInventoryJson(base),
    has_stairs: true,
    long_carry: true,
  });
}

export async function finalizeJobSpecAction(
  initialSpec: any,
  voiceSummary: string,
  isDemoMode: boolean,
) {
  try {
    let finalized = isDemoMode
      ? buildDemoFinalSpec(initialSpec)
      : undefined;

    if (!isDemoMode) {
      const openai = getOpenAIClient();

      // OpenAI SDK v6: formerly openai.beta.chat.completions.parse
      const completion = await openai.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Merge the initial moving job specification with the voice interview summary into a strict FinalJobSpec. Prefer voice clarifications for stairs and long carry. Inventory items must only include item_name and quantity.",
          },
          {
            role: "user",
            content: JSON.stringify({
              initialSpec,
              voiceSummary,
            }),
          },
        ],
        response_format: zodResponseFormat(FinalJobSpecSchema, "final_job_spec"),
      });

      const parsed = completion.choices[0]?.message.parsed;
      if (!parsed) {
        return {
          success: false as const,
          error: "Failed to merge job specification from voice summary",
        };
      }

      finalized = parsed;
    }

    if (!finalized) {
      return {
        success: false as const,
        error: "No finalized job specification was produced",
      };
    }

    const supabase = await createClient();

    const { data: insertedRecord, error } = await supabase
      .from("job_specs")
      .insert({
        title: finalized.title,
        origin_address: finalized.origin_address,
        destination_address: finalized.destination_address,
        inventory_json: finalized.inventory_json,
        has_stairs: finalized.has_stairs,
        long_carry: finalized.long_carry,
      })
      .select()
      .single();

    if (error) {
      logger.error("finalize_job_spec_insert_failed", {
        reason: error.message,
        isDemoMode,
      });
      return { success: false as const, error: error.message };
    }

    logger.info("finalize_job_spec_succeeded", {
      id: insertedRecord.id,
      isDemoMode,
    });

    return {
      success: true as const,
      data: insertedRecord as JobSpecRecord,
    };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Unknown error finalizing job specification";

    logger.error("finalize_job_spec_failed", { reason: msg });
    return { success: false as const, error: msg };
  }
}

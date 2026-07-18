"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import pdf from "pdf-parse";
import { actionFail, actionOk, type ActionResult } from "@/lib/action-result";
import { DEMO_JOB_SPEC, JobSpecSchema, type JobSpec } from "@/lib/job-spec";
import { logger } from "@/lib/logger";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
});

const env = envSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

function getOpenAIClient() {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const parsed = await pdf(buffer);
    return parsed.text;
  } catch (error) {
    logger.warn("pdf_parse_failed_falling_back_to_utf8", {
      fileName: file.name,
      reason: error instanceof Error ? error.message : "unknown",
    });
    return buffer.toString("utf-8");
  }
}

export async function extractJobSpecAction(
  formData: FormData,
  isDemoMode: boolean,
): Promise<ActionResult<JobSpec>> {
  try {
    if (isDemoMode) {
      logger.info("extract_job_spec_demo_mode");
      return actionOk(DEMO_JOB_SPEC);
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      logger.warn("extract_job_spec_missing_file");
      return actionFail(
        "MISSING_FILE",
        "No file provided. Please upload an inventory PDF or text file.",
      );
    }

    logger.info("extract_job_spec_started", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const text = await extractTextFromFile(file);
    if (!text.trim()) {
      logger.warn("extract_job_spec_empty_text", { fileName: file.name });
      return actionFail(
        "EMPTY_DOCUMENT",
        "Could not extract any text from the uploaded file.",
      );
    }

    const openai = getOpenAIClient();

    // OpenAI SDK v6: formerly openai.beta.chat.completions.parse
    const completion = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract a structured moving job specification from the provided inventory document text. Infer a concise title, origin and destination addresses, whether stairs are involved (has_stairs), and an inventory list with item names, quantities, and categories.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: zodResponseFormat(JobSpecSchema, "job_spec"),
    });

    const parsedData = completion.choices[0]?.message.parsed;

    if (!parsedData) {
      logger.error("extract_job_spec_parse_null", { fileName: file.name });
      return actionFail(
        "PARSE_FAILED",
        "Failed to parse a job specification from the document.",
      );
    }

    logger.info("extract_job_spec_succeeded", {
      fileName: file.name,
      inventoryCount: parsedData.inventory.length,
    });

    return actionOk(parsedData);
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Unknown extraction error";

    logger.error("extract_job_spec_failed", {
      reason,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return actionFail(
      "EXTRACT_FAILED",
      "Something went wrong while extracting your inventory. Please try again or enable Demo Mode.",
    );
  }
}

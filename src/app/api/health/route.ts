import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    openai: Boolean(process.env.OPENAI_API_KEY),
    supabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  };

  const healthy = checks.openai && checks.supabase;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      service: "the-negotiator",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 },
  );
}

import { DocumentIntake } from "@/components/DocumentIntake";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
      <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The Negotiator: AI-Powered Estimates
          </h1>
          <p className="text-base leading-relaxed text-accent sm:text-lg">
            Upload your inventory PDF so our agents can lock in line-item
            clarity before the call — preventing up to 40% in surprise
            upcharges.
          </p>
        </div>

        <DocumentIntake />
      </div>
    </main>
  );
}

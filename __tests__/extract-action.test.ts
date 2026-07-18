import { DEMO_JOB_SPEC } from "@/lib/job-spec";
import { extractJobSpecAction } from "@/actions/extract";

describe("extractJobSpecAction", () => {
  it("instantly returns mocked data when isDemoMode is true", async () => {
    const result = await extractJobSpecAction(new FormData(), true);

    expect(result).toEqual({
      success: true,
      data: DEMO_JOB_SPEC,
    });
  });
});

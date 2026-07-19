import { DEMO_JOB_SPEC } from "@/lib/job-spec";

const mockInsertSingle = jest.fn();

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(async () => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: mockInsertSingle,
        })),
      })),
    })),
  })),
}));

import { finalizeJobSpecAction } from "@/actions/finalizeSpec";

describe("finalizeJobSpecAction", () => {
  beforeEach(() => {
    mockInsertSingle.mockReset();
  });

  it("merges boolean flags in demo mode and returns a database record", async () => {
    const simulatedRecord = {
      id: "11111111-2222-3333-4444-555555555555",
      title: DEMO_JOB_SPEC.title,
      origin_address: DEMO_JOB_SPEC.origin_address,
      destination_address: DEMO_JOB_SPEC.destination_address,
      inventory_json: DEMO_JOB_SPEC.inventory.map(({ item_name, quantity }) => ({
        item_name,
        quantity,
      })),
      has_stairs: true,
      long_carry: true,
      created_at: "2026-07-18T00:00:00.000Z",
    };

    mockInsertSingle.mockResolvedValue({
      data: simulatedRecord,
      error: null,
    });

    const result = await finalizeJobSpecAction(
      { ...DEMO_JOB_SPEC, has_stairs: false },
      "User stated there are 2 flights of stairs",
      true,
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.id).toBe(simulatedRecord.id);
    expect(result.data.has_stairs).toBe(true);
    expect(result.data.long_carry).toBe(true);
    expect(result.data.inventory_json.length).toBeGreaterThan(0);
  });
});

import { z } from "zod";

export const FinalJobSpecSchema = z.object({
  title: z.string(),
  origin_address: z.string(),
  destination_address: z.string(),
  inventory_json: z.array(
    z.object({
      item_name: z.string(),
      quantity: z.number(),
    }),
  ),
  has_stairs: z.boolean(),
  long_carry: z.boolean(),
});

export type FinalJobSpec = z.infer<typeof FinalJobSpecSchema>;

export type JobSpecRecord = FinalJobSpec & {
  id: string;
  user_id?: string | null;
  created_at?: string | null;
};

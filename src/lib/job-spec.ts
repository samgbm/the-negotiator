import { z } from "zod";

export const JobSpecSchema = z.object({
  title: z.string(),
  origin_address: z.string(),
  destination_address: z.string(),
  inventory: z.array(
    z.object({
      item_name: z.string(),
      quantity: z.number(),
      category: z.string(),
    }),
  ),
  has_stairs: z.boolean(),
});

export type JobSpec = z.infer<typeof JobSpecSchema>;

/** Hardcoded Rock Hill → Charlotte demo payload used when Demo Mode is on. */
export const DEMO_JOB_SPEC: JobSpec = {
  title: "2-Bedroom Apartment Move: Rock Hill → Charlotte",
  origin_address: "412 Ebenezer Rd, Rock Hill, SC 29732",
  destination_address: "200 S Tryon St, Apt 1408, Charlotte, NC 28202",
  has_stairs: true,
  inventory: [
    {
      item_name: "Queen mattress & box spring",
      quantity: 1,
      category: "bedroom",
    },
    {
      item_name: "Queen bed frame",
      quantity: 1,
      category: "bedroom",
    },
    {
      item_name: "Twin bed set",
      quantity: 1,
      category: "bedroom",
    },
    {
      item_name: "Sectional sofa",
      quantity: 1,
      category: "living room",
    },
    {
      item_name: "Coffee table",
      quantity: 1,
      category: "living room",
    },
    {
      item_name: "55-inch TV",
      quantity: 1,
      category: "electronics",
    },
    {
      item_name: "Dining table with 4 chairs",
      quantity: 1,
      category: "dining",
    },
    {
      item_name: "Washer & dryer set",
      quantity: 1,
      category: "appliances",
    },
    {
      item_name: "Medium moving boxes",
      quantity: 28,
      category: "boxes",
    },
    {
      item_name: "Wardrobe boxes",
      quantity: 4,
      category: "boxes",
    },
  ],
};

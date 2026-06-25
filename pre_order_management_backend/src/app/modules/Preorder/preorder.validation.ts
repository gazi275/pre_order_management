import { z } from "zod";

const create = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  products: z.number().int().nonnegative().optional(),
  preorderWhen: z.enum(["out-of-stock", "regardless-of-stock"]).optional(),
  startsAt: z.string({
    required_error: "startsAt is required",
  }), // datetime string
  endsAt: z.string().nullable().optional(), // datetime string or null
  status: z.enum(["active", "inactive"]).optional(),
});

const update = z.object({
  name: z.string().optional(),
  products: z.number().int().nonnegative().optional(),
  preorderWhen: z.enum(["out-of-stock", "regardless-of-stock"]).optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().nullable().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const PreorderValidation = {
  create,
  update,
};

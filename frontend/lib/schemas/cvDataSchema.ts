import { z } from "zod";

export const CVDataSchema = z.object({
  role: z.string().min(1, "Role is required"),
  years_experience: z.number().int().nonnegative().optional(),
  location: z.string().min(3, "Location is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  summary: z.string().min(1, "Summary is required"),
});

export type CVData = z.infer<typeof CVDataSchema>;

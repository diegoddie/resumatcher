import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export const fileSchema = z
  .instanceof(File)
  .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
    message: "File must be a PDF or DOCX",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File must be smaller than 5MB",
  });

import { z } from "zod";

export const createDepartmentSchema = z.object({
  code: z
    .string({ required_error: "code is required" })
    .min(1, "code is required")
    .max(50, "code must be at most 50 characters"),
  name: z
    .string({ required_error: "name is required" })
    .min(1, "name is required")
    .max(255, "name must be at most 255 characters"),
  description: z.string().optional().nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const createSubjectSchema = z.object({
  departmentId: z
    .number({ required_error: "departmentId is required" })
    .int("departmentId must be an integer"),
  name: z
    .string({ required_error: "name is required" })
    .min(1, "name is required")
    .max(255, "name must be at most 255 characters"),
  code: z
    .string({ required_error: "code is required" })
    .min(1, "code is required")
    .max(50, "code must be at most 50 characters"),
  description: z.string().optional().nullable(),
});

export const updateSubjectSchema = createSubjectSchema.partial();

export const createClassSchema = z.object({
  name: z
    .string({ required_error: "name is required" })
    .min(1, "name is required")
    .max(255, "name must be at most 255 characters"),
  subjectId: z
    .number({ required_error: "subjectId is required" })
    .int("subjectId must be an integer"),
  teacherId: z
    .string({ required_error: "teacherId is required" })
    .min(1, "teacherId is required"),
  capacity: z.number().int().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  bannerUrl: z.string().optional().nullable(),
  bannerCldPubId: z.string().optional().nullable(),
  inviteCode: z.string().max(50).optional(),
});

export const updateClassSchema = createClassSchema.partial();

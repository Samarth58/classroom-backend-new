import express from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import { classes, departments, enrollments, subjects, user } from "../db/schema/index.js";

import { authenticate, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createClassSchema, updateClassSchema } from "../lib/schemas.js";

const router = express.Router();


// Get all classes with optional search, subject, teacher filters, and pagination
router.get("/", async (req, res) => {
  try {
    const { search, subject, teacher, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    if (search) {
      filterConditions.push(
        or(
          ilike(classes.name, `%${search}%`),
          ilike(classes.inviteCode, `%${search}%`)
        )
      );
    }

    if (subject) {
      filterConditions.push(ilike(subjects.name, `%${subject}%`));
    }

    if (teacher) {
      filterConditions.push(ilike(user.name, `%${teacher}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const classesList = await db
      .select({
        ...getTableColumns(classes),
        subject: {
          ...getTableColumns(subjects),
        },
        teacher: {
          ...getTableColumns(user),
        },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause)
      .orderBy(desc(classes.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: classesList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /classes error:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

const generateInviteCode = () => Math.random().toString(36).substring(2, 9);

router.post("/", authenticate, requireRole("admin", "teacher"), validateBody(createClassSchema), async (req, res) => {
  try {
    const {
      name,
      teacherId,
      subjectId,
      capacity,
      description,
      status,
      bannerUrl,
      bannerCldPubId,
      inviteCode: customInviteCode,
    } = req.body;

    const isCustomInviteCode = Boolean(customInviteCode && typeof customInviteCode === "string" && customInviteCode.trim().length > 0);
    let inviteCodeToUse = isCustomInviteCode ? customInviteCode.trim() : generateInviteCode();
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const [createdClass] = await db
          .insert(classes)
          .values({
            subjectId,
            inviteCode: inviteCodeToUse,
            name,
            teacherId,
            bannerCldPubId,
            bannerUrl,
            capacity,
            description,
            schedules: [],
            status,
          })
          .returning({ id: classes.id });

        if (!createdClass) throw new Error("Failed to create class");

        return res.status(201).json({ data: createdClass });
      } catch (error: any) {
        const isUniqueViolation = error?.code === "23505" || error?.cause?.code === "23505";
        const isFkViolation = error?.code === "23503" || error?.cause?.code === "23503";

        if (isFkViolation) {
          return res.status(400).json({ error: "Referenced subject or teacher does not exist" });
        }

        if (isUniqueViolation) {
          if (isCustomInviteCode) {
            return res.status(409).json({ error: "Class invite code already exists" });
          }
          if (attempts < maxAttempts) {
            inviteCodeToUse = generateInviteCode();
            continue;
          }
          return res.status(409).json({ error: "Class invite code already exists" });
        }

        throw error;
      }
    }
  } catch (error: any) {
    console.error("POST /classes error:", error);
    res.status(500).json({ error: "Failed to create class" });
  }
});

// Get class details with counts
router.get("/:id", async (req, res) => {
  try {
    const classId = Number(req.params.id);

    if (!Number.isFinite(classId)) {
      return res.status(400).json({ error: "Invalid class id" });
    }

    const [classDetails] = await db
      .select({
        ...getTableColumns(classes),
        subject: {
          ...getTableColumns(subjects),
        },
        department: {
          ...getTableColumns(departments),
        },
        teacher: {
          ...getTableColumns(user),
        },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(eq(classes.id, classId));

    if (!classDetails) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json({ data: classDetails });
  } catch (error) {
    console.error("GET /classes/:id error:", error);
    res.status(500).json({ error: "Failed to fetch class details" });
  }
});

// List users in a class by role with pagination
router.get("/:id/users", async (req, res) => {
  try {
    const classId = Number(req.params.id);
    const { role, page = 1, limit = 10 } = req.query;

    if (!Number.isFinite(classId)) {
      return res.status(400).json({ error: "Invalid class id" });
    }

    if (role !== "teacher" && role !== "student") {
      return res.status(400).json({ error: "Invalid role" });
    }

    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const baseSelect = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      imageCldPubId: user.imageCldPubId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const groupByFields = [
      user.id,
      user.name,
      user.email,
      user.emailVerified,
      user.image,
      user.role,
      user.imageCldPubId,
      user.createdAt,
      user.updatedAt,
    ];

    const countResult =
      role === "teacher"
        ? await db
            .select({ count: sql<number>`count(distinct ${user.id})` })
            .from(user)
            .leftJoin(classes, eq(user.id, classes.teacherId))
            .where(and(eq(user.role, role), eq(classes.id, classId)))
        : await db
            .select({ count: sql<number>`count(distinct ${user.id})` })
            .from(user)
            .leftJoin(enrollments, eq(user.id, enrollments.studentId))
            .where(and(eq(user.role, role), eq(enrollments.classId, classId)));

    const totalCount = countResult[0]?.count ?? 0;

    const usersList =
      role === "teacher"
        ? await db
            .select(baseSelect)
            .from(user)
            .leftJoin(classes, eq(user.id, classes.teacherId))
            .where(and(eq(user.role, role), eq(classes.id, classId)))
            .groupBy(...groupByFields)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset)
        : await db
            .select(baseSelect)
            .from(user)
            .leftJoin(enrollments, eq(user.id, enrollments.studentId))
            .where(and(eq(user.role, role), eq(enrollments.classId, classId)))
            .groupBy(...groupByFields)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset);

    res.status(200).json({
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /classes/:id/users error:", error);
    res.status(500).json({ error: "Failed to fetch class users" });
  }
});

// Update class (partial)
router.patch("/:id", authenticate, requireRole("admin", "teacher"), validateBody(updateClassSchema), async (req, res) => {
  try {
    const classId = Number(req.params.id);

    if (!Number.isFinite(classId)) {
      return res.status(400).json({ error: "Invalid class id" });
    }

    const [existing] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.id, classId));

    if (!existing) {
      return res.status(404).json({ error: "Class not found" });
    }

    const updates = req.body as Record<string, unknown>;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const [updated] = await db
      .update(classes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(classes.id, classId))
      .returning();

    return res.status(200).json({ data: updated });
  } catch (error: any) {
    console.error("PATCH /classes/:id error:", error);
    if (error?.code === "23505" || error?.cause?.code === "23505") {
      return res.status(409).json({ error: "Class invite code already exists" });
    }
    if (error?.code === "23503" || error?.cause?.code === "23503") {
      return res.status(400).json({ error: "Referenced subject or teacher does not exist" });
    }
    return res.status(500).json({ error: "Failed to update class" });
  }
});

// Delete class (cascades to enrollments)
router.delete("/:id", authenticate, requireRole("admin", "teacher"), async (req, res) => {
  try {
    const classId = Number(req.params.id);

    if (!Number.isFinite(classId)) {
      return res.status(400).json({ error: "Invalid class id" });
    }

    const [existingClass] = await db
      .select({ id: classes.id })
      .from(classes)
      .where(eq(classes.id, classId));

    if (!existingClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    await db.delete(classes).where(eq(classes.id, classId));

    return res.status(200).json({ data: { message: "Class deleted successfully" } });
  } catch (error: any) {
    console.error("DELETE /classes/:id error:", error);
    return res.status(500).json({ error: "Failed to delete class" });
  }
});

export default router;


import express from "express";
import { and, eq, getTableColumns } from "drizzle-orm";

import { db } from "../db/index.js";
import { classes, departments, enrollments, subjects, user } from "../db/schema/index.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const getEnrollmentDetails = async (enrollmentId: number) => {
  const [enrollment] = await db
    .select({
      ...getTableColumns(enrollments),
      class: {
        ...getTableColumns(classes),
      },
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
    .from(enrollments)
    .leftJoin(classes, eq(enrollments.classId, classes.id))
    .leftJoin(subjects, eq(classes.subjectId, subjects.id))
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .leftJoin(user, eq(classes.teacherId, user.id))
    .where(eq(enrollments.id, enrollmentId));

  return enrollment;
};

// Create enrollment
router.post("/", authenticate, async (req, res) => {
  try {
    const { classId } = req.body;
    const callerRole = req.user!.role;
    const callerId = req.user!.id;

    // Resolve effective studentId: students always enroll themselves
    let effectiveStudentId: string;
    if (callerRole === "student") {
      if (req.body.studentId && req.body.studentId !== callerId) {
        return res.status(403).json({ error: "Cannot enroll another user" });
      }
      effectiveStudentId = callerId;
    } else {
      // admin / teacher may specify any studentId
      effectiveStudentId = req.body.studentId;
    }

    if (!classId || !effectiveStudentId) {
      return res
        .status(400)
        .json({ error: "classId and studentId are required" });
    }

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!classRecord) return res.status(404).json({ error: "Class not found" });

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, effectiveStudentId));

    if (!student) return res.status(404).json({ error: "Student not found" });

    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classId),
          eq(enrollments.studentId, effectiveStudentId)
        )
      );

    if (existingEnrollment)
      return res
        .status(409)
        .json({ error: "Student already enrolled in class" });

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId, studentId: effectiveStudentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment)
      return res.status(500).json({ error: "Failed to create enrollment" });

    const enrollment = await getEnrollmentDetails(createdEnrollment.id);

    res.status(201).json({ data: enrollment });
  } catch (error: any) {
    console.error("POST /enrollments error:", error);
    if (error?.code === "23505") {
      return res.status(409).json({ error: "Student already enrolled in class" });
    }
    res.status(500).json({ error: "Failed to create enrollment" });
  }
});

// Join class by invite code
router.post("/join", authenticate, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const callerRole = req.user!.role;
    const callerId = req.user!.id;

    // Resolve effective studentId: students always enroll themselves
    let effectiveStudentId: string;
    if (callerRole === "student") {
      if (req.body.studentId && req.body.studentId !== callerId) {
        return res.status(403).json({ error: "Cannot enroll another user" });
      }
      effectiveStudentId = callerId;
    } else {
      effectiveStudentId = req.body.studentId;
    }

    if (!inviteCode || !effectiveStudentId) {
      return res
        .status(400)
        .json({ error: "inviteCode and studentId are required" });
    }

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.inviteCode, inviteCode));

    if (!classRecord) return res.status(404).json({ error: "Class not found" });

    const [student] = await db
      .select()
      .from(user)
      .where(eq(user.id, effectiveStudentId));

    if (!student) return res.status(404).json({ error: "Student not found" });

    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classRecord.id),
          eq(enrollments.studentId, effectiveStudentId)
        )
      );

    if (existingEnrollment)
      return res
        .status(409)
        .json({ error: "Student already enrolled in class" });

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId: classRecord.id, studentId: effectiveStudentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment)
      return res.status(500).json({ error: "Failed to create enrollment" });

    const enrollment = await getEnrollmentDetails(createdEnrollment.id);

    res.status(201).json({ data: enrollment });
  } catch (error: any) {
    console.error("POST /enrollments/join error:", error);
    if (error?.code === "23505") {
      return res.status(409).json({ error: "Student already enrolled in class" });
    }
    res.status(500).json({ error: "Failed to create enrollment" });
  }
});

// Delete enrollment (accessible by student owner or admin/teacher)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const enrollmentId = Number(req.params.id);

    if (!Number.isFinite(enrollmentId)) {
      return res.status(400).json({ error: "Invalid enrollment id" });
    }

    const [existingEnrollment] = await db
      .select({ id: enrollments.id, studentId: enrollments.studentId })
      .from(enrollments)
      .where(eq(enrollments.id, enrollmentId));

    if (!existingEnrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const isElevatedUser = req.user?.role === "admin" || req.user?.role === "teacher";
    const isOwner = req.user?.id === existingEnrollment.studentId;

    if (!isElevatedUser && !isOwner) {
      return res.status(403).json({ error: "Cannot remove another user's enrollment" });
    }

    await db.delete(enrollments).where(eq(enrollments.id, enrollmentId));

    return res.status(200).json({ data: { message: "Enrollment deleted successfully" } });
  } catch (error) {
    console.error("DELETE /enrollments/:id error:", error);
    return res.status(500).json({ error: "Failed to delete enrollment" });
  }
});

export default router;

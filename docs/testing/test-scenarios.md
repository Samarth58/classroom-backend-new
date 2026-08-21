# Test Scenarios & Test Cases — Classroom Management System

Continuation of the Master Test Plan. This document covers Steps 3–5 of the QA workflow: Test Scenarios, detailed Test Cases, and Test Environment setup — grounded in the verified codebase (see Master Test Plan §34 for source citations).

---

## Step 3 — Test Scenarios

### Module: Authentication
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-001 | Verify user registration via `POST /api/auth/sign-up/email` (Positive / E2E) | API, Functional, Authentication, E2E | Critical |
| TS-002 | Verify user login via `POST /api/auth/sign-in/email` (Positive / Auth) | API, Functional, Authentication | Critical |
| TS-003 | Verify invalid login (wrong password / non-existent email) (Negative / Auth) | API, Authentication, Negative | Critical |
| TS-004 | Verify logout via `POST /api/auth/sign-out` (Positive / Auth) | API, Functional, Authentication | High |
| TS-005 | Verify protected routes reject requests without session cookie (Unauthorized Access) | API, Security, Authentication, Negative | Critical |
| TS-006 | Verify duplicate email registration is rejected (Duplicate Data / Boundary) | API, Boundary, Duplicate Data, Negative | Critical |
| TS-007 | Verify default role assignment (`student`) when role is omitted at sign-up (Validation / Default) | API, Functional, Authorization/RBAC | Medium |

### Module: Departments
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-008 | Create department as admin/teacher (Positive / CRUD) | API, Functional, Authorization/RBAC | High |
| TS-009 | View department list with pagination (Positive / List) | API, Functional | Medium |
| TS-010 | Search departments by code or name (Positive / Search) | API, Functional | Medium |
| TS-011 | Update department details (Positive / Update) | API, Functional, Authorization/RBAC | High |
| TS-012 | Delete department as admin (Positive / Delete) | API, Functional, Authorization/RBAC | High |
| TS-013 | Prevent department deletion when active subjects exist (configured `onDelete: "restrict"`) | API, Database, Negative | High |
| TS-014 | Reject department creation with duplicate `code` (Duplicate Data / DB) | API, Database, Duplicate Data, Negative | High |
| TS-015 | Reject department creation by `student` role (403 Forbidden / RBAC) | API, Authorization/RBAC, Security, Negative | Critical |
| TS-054 | Reject department request with invalid non-numeric ID `GET /api/departments/abc` (Invalid IDs / Error Handling) | API, Invalid IDs, Negative | High |

### Module: Subjects
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-016 | Create subject linked to a valid department (Positive / Integration) | API, Functional, Integration | High |
| TS-017 | View subject list with department filter (Positive / Filter) | API, Functional | Medium |
| TS-018 | Update subject details (Positive / Update) | API, Functional, Authorization/RBAC | High |
| TS-019 | Delete subject as admin — verify cascade to dependent classes (configured `onDelete: "cascade"`) | API, Database, Functional | High |
| TS-020 | Reject subject creation with non-existent `departmentId` (Invalid IDs / Negative) | API, Database, Invalid IDs, Negative | High |
| TS-021 | Reject subject creation with duplicate `code` (Duplicate Data / DB) | API, Database, Duplicate Data, Negative | High |
| TS-055 | Reject subject creation with missing required fields (Missing Data / Validation) | API, Validation, Missing Data, Negative | High |

### Module: Classes
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-022 | Create class linked to a valid subject and teacher (Positive / E2E) | API, Functional, Integration, E2E | High |
| TS-023 | Verify auto-generated `inviteCode` on class creation (Positive / Functional) | API, Functional | Medium |
| TS-024 | View class list filtered by subject or teacher (Positive / Filter) | API, Functional | Medium |
| TS-025 | View single class with joined subject, department, teacher data (Positive / Read) | API, Integration, Database | Medium |
| TS-026 | Update class details (Positive / Update) | API, Functional, Authorization/RBAC | High |
| TS-027 | Delete class as admin — verify cascade to enrollments (configured `onDelete: "cascade"`) | API, Database, Functional | High |
| TS-028 | Reject class creation by `student` role (403 Forbidden / RBAC) | API, Authorization/RBAC, Security, Negative | Critical |
| TS-029 | Reject class creation with non-existent `subjectId` or `teacherId` (Invalid IDs / Negative) | API, Database, Invalid IDs, Negative | High |
| TS-056 | Reject class creation with missing required schedule/capacity fields (Missing Data / Validation) | API, Validation, Missing Data, Negative | High |

### Module: Enrollments
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-030 | Student self-enrolls with valid invite code (Positive / E2E) | API, Functional, E2E | High |
| TS-031 | Reject enrollment with an invalid invite code (Negative / Validation) | API, Functional, Negative | High |
| TS-032 | Reject enrollment when class is at full capacity (Boundary / Capacity) | API, Boundary, Negative | High |
| TS-033 | Reject duplicate enrollment for same student in same class (Duplicate Data / DB) | API, Database, Duplicate Data, Negative | High |
| TS-034 | Remove a student's enrollment (Positive / Delete) | API, Functional | High |
| TS-035 | **Security scenario:** Verify Student A cannot enroll Student B (Cross-User / Authorization) | API, Security, Authorization/RBAC, Negative | Critical |
| TS-036 | **Security scenario:** Verify Student A cannot remove Student B's enrollment (Cross-User / Authorization) | API, Security, Authorization/RBAC, Negative | Critical |
| TS-037 | Verify teacher/admin can enroll a student on their behalf (Positive / RBAC) | API, Authorization/RBAC, Functional | High |
| TS-057 | Reject enrollment request with missing `classId` or `studentId` (Missing Data / Validation) | API, Validation, Missing Data, Negative | High |

### Module: Dashboard / Analytics
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-038 | Verify `GET /api/dashboard/metrics` returns correct aggregate counts (Positive / Read) | API, Functional, Database | Medium |
| TS-039 | Verify whether `GET /api/dashboard/metrics` is intentionally public and complies with security requirements (Security Check) | API, Security, Authentication | Medium |
| TS-040 | Verify chart data structures (`userDistribution`, `classesByDepartment`, `capacityStatus`) (Positive / Contract) | API, Functional | Medium |

### Module: API Contract & Response Envelope
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-041 | Verify pagination envelope shape across all list endpoints (Contract / Envelope) | API, Functional | Medium |
| TS-042 | Verify error responses return structured `{ error: "..." }` (Error Handling) | API, Functional, Negative | High |
| TS-043 | Verify invalid numeric IDs return `400 Bad Request`, not `500` (Invalid IDs / Negative) | API, Negative, Boundary, Invalid IDs | High |
| TS-044 | Verify non-existent resource IDs return `404 Not Found` (Error Handling / Negative) | API, Negative, Invalid IDs | High |

### Module: Database Integrity
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-045 | Verify unique constraints (department code, subject code, invite code, user email) (DB Integrity) | Database, Integration | High |
| TS-046 | Verify cascade delete: Subject → Classes (configured `onDelete: "cascade"`) | Database, Integration | High |
| TS-047 | Verify cascade delete: Class → Enrollments (configured `onDelete: "cascade"`) | Database, Integration | High |
| TS-048 | Verify restrict delete: Department with active subjects (configured `onDelete: "restrict"`) | Database, Integration, Negative | High |
| TS-049 | Verify restrict delete: Teacher assigned to a class (configured `onDelete: "restrict"`) | Database, Integration, Negative | High |

### Module: Security & RBAC
| ID | Scenario | Test Type | Priority |
|---|---|---|---|
| TS-050 | Verify role-based access matrix across all protected routes (see Master Test Plan §7) (RBAC / Security) | Security, Authorization/RBAC | Critical |
| TS-051 | Verify CORS rejects requests from disallowed origins (Security / CORS) | Security, API | Medium |
| TS-052 | Verify handling of malformed/missing request bodies on mutation endpoints (Error Handling / Validation) | API, Security, Negative | High |
| TS-053 | Verify Arcjet rate limiting under `NODE_ENV=production` (Performance / Security) | Security, Performance, API | Medium |

---

## Step 4 — Detailed Test Cases

All detailed test cases explicitly separate **Expected Result** (requirements/standards), **Current Implementation** (code/library audit findings), **Recommended Behavior** (remediation where implementation differs from expected), and full pre-execution tracking attributes (`Status: Not Executed`).

### TC-LOGIN-001 — Valid Login
- **Test Case ID:** TC-LOGIN-001
- **Module:** Authentication
- **Test Type:** API, Functional, Authentication, Positive
- **Priority:** Critical
- **Preconditions:** A registered user exists (`student1@example.com` / `[PLACEHOLDER_PASSWORD]`).
- **Test Data:** `{ "email": "student1@example.com", "password": "[PLACEHOLDER_PASSWORD]" }`
- **Test Steps:**
  1. Send `POST /api/auth/sign-in/email` with valid credential payload.
- **Expected Result:** `200 OK`; response payload contains `{ user: { id, email, name, role } }`; `Set-Cookie: better-auth.session_token=...; HttpOnly` header present.
- **Current Implementation:** Route delegates authentication directly to better-auth email credentials handler which returns 200 with session cookie.
- **Recommended Behavior:** Matches expected specification (`200 OK` with session cookie).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-LOGIN-002 — Invalid Password
- **Test Case ID:** TC-LOGIN-002
- **Module:** Authentication
- **Test Type:** API, Authentication, Negative
- **Priority:** Critical
- **Preconditions:** User `student1@example.com` exists.
- **Test Data:** `{ "email": "student1@example.com", "password": "WrongPassword!" }`
- **Test Steps:**
  1. Send `POST /api/auth/sign-in/email` with correct email and incorrect password.
- **Expected Result:** `401 Unauthorized`; no `Set-Cookie` session header issued.
- **Current Implementation:** Handled by better-auth credentials validation logic returning 401.
- **Recommended Behavior:** Matches expected specification (`401 Unauthorized`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-LOGIN-003 — Missing Email Field
- **Test Case ID:** TC-LOGIN-003
- **Module:** Authentication
- **Test Type:** API, Authentication, Missing Data, Validation, Negative
- **Priority:** High
- **Preconditions:** None.
- **Test Data:** `{ "password": "[PLACEHOLDER_PASSWORD]" }`
- **Test Steps:**
  1. Send `POST /api/auth/sign-in/email` omitting the required `email` field.
- **Expected Result:** The API should reject invalid input with a controlled validation error (`400 Bad Request` or `422 Unprocessable Entity`).
- **Current Implementation:** better-auth default schema validation catches missing fields and returns `422 Unprocessable Entity`.
- **Recommended Behavior:** Matches expected specification (`422 Unprocessable Entity`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-REG-001 — Duplicate Email Registration
- **Test Case ID:** TC-REG-001
- **Module:** Authentication
- **Test Type:** API, Authentication, Duplicate Data, Boundary, Negative
- **Priority:** Critical
- **Preconditions:** `student1@example.com` already exists in database.
- **Test Data:** `{ "email": "student1@example.com", "password": "[PLACEHOLDER_PASSWORD]", "name": "Duplicate Student" }`
- **Test Steps:**
  1. Send `POST /api/auth/sign-up/email` with an existing email address.
- **Expected Result:** The API should reject duplicate email registration with a controlled error response (`422 Unprocessable Entity` or `409 Conflict`); no new user row created.
- **Current Implementation:** better-auth pre-checks email uniqueness against user table and returns `422 Unprocessable Entity`.
- **Recommended Behavior:** Matches expected specification (`422 Unprocessable Entity`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-AUTH-001 — Unauthenticated Mutation Access
- **Test Case ID:** TC-AUTH-001
- **Module:** Security & RBAC
- **Test Type:** API, Security, Authentication, Unauthorized Access, Negative
- **Priority:** Critical
- **Preconditions:** No session cookie attached in HTTP request.
- **Test Data:** `{ "code": "CS", "name": "Computer Science" }`
- **Test Steps:**
  1. Send `POST /api/departments` without session authentication cookies.
- **Expected Result:** `401 Unauthorized` with structured error payload `{ error: "Unauthorized" }`.
- **Current Implementation:** Authentication middleware inspects request cookies for active session token; returns `401 Unauthorized` if unauthenticated.
- **Recommended Behavior:** Matches expected specification (`401 Unauthorized`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-AUTH-002 — Role-Forbidden Mutation
- **Test Case ID:** TC-AUTH-002
- **Module:** Security & RBAC
- **Test Type:** API, Security, Authorization/RBAC, Negative
- **Priority:** Critical
- **Preconditions:** Logged in as a user with `student` role.
- **Test Data:** `{ "name": "Forbidden Department", "code": "FORB" }`
- **Test Steps:**
  1. Send `POST /api/departments` using student session cookie.
- **Expected Result:** `403 Forbidden` with structured error payload `{ error: "Forbidden" }`.
- **Current Implementation:** Role authorization middleware verifies user session role against permitted route roles (`admin`/`teacher`).
- **Recommended Behavior:** Matches expected specification (`403 Forbidden`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-ENR-001 — Valid Self-Enrollment
- **Test Case ID:** TC-ENR-001
- **Module:** Enrollments
- **Test Type:** API, Functional, E2E, Positive
- **Priority:** High
- **Preconditions:** Class exists with valid invite code `"CS101-SPRING"`; logged in as Student A (`studentId: <student_a_uuid>`).
- **Test Data:** `{ "classId": 1, "studentId": "<student_a_uuid>" }`
- **Test Steps:**
  1. Send `POST /api/enrollments` with valid `classId` and Student A's own `studentId`.
- **Expected Result:** `201 Created`, returning enrollment payload `{ data: { id, classId, studentId, class, subject, department, teacher } }`.
- **Current Implementation:** Handler validates required fields, verifies class and student existence, inserts enrollment, and returns `201 Created` with joined details.
- **Recommended Behavior:** Matches expected specification (`201 Created`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-ENR-002 — Invalid Invite Code
- **Test Case ID:** TC-ENR-002
- **Module:** Enrollments
- **Test Type:** API, Functional, Validation, Negative
- **Priority:** High
- **Preconditions:** Logged in as Student A (`studentId: <student_a_uuid>`).
- **Test Data:** `{ "inviteCode": "INVALID_CODE", "studentId": "<student_a_uuid>" }`
- **Test Steps:**
  1. Send `POST /api/enrollments/join` with an invalid `inviteCode`.
- **Expected Result:** `404 Not Found` or `400 Bad Request`, returning structured error `{ error: "Class not found" }` or `{ error: "Invalid invite code" }`.
- **Current Implementation:** Route pre-queries `classes` table by `inviteCode` and returns `404 Not Found` with `{ error: "Class not found" }` if no matching class exists.
- **Recommended Behavior:** Matches current implementation (`404 Not Found`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-ENR-003 — Class at Full Capacity
- **Test Case ID:** TC-ENR-003
- **Module:** Enrollments
- **Test Type:** API, Boundary, Negative
- **Priority:** High
- **Preconditions:** Target class active enrollments count equals configured `capacity`; logged in as Student A.
- **Test Data:** `{ "inviteCode": "FULL-CLASS-CODE", "studentId": "<student_a_uuid>" }`
- **Test Steps:**
  1. Send `POST /api/enrollments/join` for a full capacity class.
- **Expected Result:** `400 Bad Request`, returning structured error `{ error: "Class is at full capacity" }`.
- **Current Implementation:** `POST /api/enrollments/join` in `src/routes/enrollments.ts` does not explicitly check current enrollment count against class capacity before inserting into `enrollments` table.
- **Recommended Behavior:** Add capacity count check before insertion and return `400 Bad Request` with `{ error: "Class is at full capacity" }`.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-ENR-004 — Duplicate Enrollment
- **Test Case ID:** TC-ENR-004
- **Module:** Enrollments
- **Test Type:** API, Database, Duplicate Data, Negative
- **Priority:** High
- **Preconditions:** Student A (`studentId: <student_a_uuid>`) is already enrolled in Class 1 (`classId: 1`).
- **Test Data:** `{ "classId": 1, "studentId": "<student_a_uuid>" }`
- **Test Steps:**
  1. Repeat enrollment request `POST /api/enrollments` for Student A in Class 1.
- **Expected Result:** `409 Conflict`, returning structured error `{ error: "Student already enrolled in class" }`.
- **Current Implementation:** Route explicitly queries `enrollments` table for `(classId, studentId)` pre-insertion and returns `409 Conflict`. Also catches Postgres unique violation `23505` and returns `409 Conflict`.
- **Recommended Behavior:** Matches expected specification (`409 Conflict`).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-ENR-005 — Cross-Student Enrollment (Security Test)
- **Test Case ID:** TC-ENR-005
- **Module:** Security & RBAC
- **Test Type:** API, Security, Authorization/RBAC, Unauthorized Access, Negative
- **Priority:** Critical
- **Preconditions:** Logged in as Student A (`studentId: <student_a_uuid>`).
- **Test Data:** `{ "classId": 1, "studentId": "<student_b_uuid>" }`
- **Test Steps:**
  1. Send `POST /api/enrollments` with Student B's `studentId` using Student A's session.
- **Expected Result:** Request must be rejected with an appropriate authorization response (`403 Forbidden` or `400 Bad Request`). Student A must NOT be able to enroll Student B.
- **Current Implementation:** Route handler in `src/routes/enrollments.ts` accepts `studentId` from `req.body` without verifying `req.user.id === studentId` or checking for elevated `teacher`/`admin` role.
- **Recommended Behavior:** Enforce identity scoping (`req.user.id === studentId` unless role is `teacher` or `admin`) and return `403 Forbidden`.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-ENR-006 — Cross-Student Unenrollment (Security Test)
- **Test Case ID:** TC-ENR-006
- **Module:** Security & RBAC
- **Test Type:** API, Security, Authorization/RBAC, Unauthorized Access, Negative
- **Priority:** Critical
- **Preconditions:** Student B is enrolled in Class 1; logged in as Student A.
- **Test Data:** Target enrollment record ID for Student B
- **Test Steps:**
  1. Send `DELETE /api/enrollments/:id` targeting Student B's enrollment using Student A's session.
- **Expected Result:** Request must be rejected with an appropriate authorization response (`403 Forbidden` or `400 Bad Request`). Student A must NOT be able to remove Student B's enrollment.
- **Current Implementation:** Deletion handler does not check whether `req.user.id` matches the enrollment's `studentId` or if user has administrative rights.
- **Recommended Behavior:** Enforce ownership authorization check before deleting enrollment and return `403 Forbidden` for unauthorized attempts.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-DEPT-001 — Restrict Delete with Active Subjects
- **Test Case ID:** TC-DEPT-001
- **Module:** Departments
- **Test Type:** API, Database, Negative
- **Priority:** High
- **Preconditions:** Target department has active associated subjects; logged in as `admin`.
- **Test Data:** `departmentId` with active subjects
- **Test Steps:**
  1. Send `DELETE /api/departments/:id`.
- **Expected Result:** The API should prevent deletion and return a controlled error response (`400 Bad Request` or `409 Conflict`) indicating active subjects exist.
- **Current Implementation:** Verified in `src/db/schema/app.ts` (`subjects.departmentId` references `departments.id` with `onDelete: "restrict"`). Database blocks deletion, but missing error handling in route handler surfaces this as uncaught exception returning `500 Internal Server Error` with `{ error: "Failed to delete department" }`.
- **Recommended Behavior:** Catch foreign key restriction error (`code: "23503"`) and return `400 Bad Request` or `409 Conflict` with `{ error: "Cannot delete department with active subjects" }`.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-DEPT-002 — Duplicate Department Code
- **Test Case ID:** TC-DEPT-002
- **Module:** Departments
- **Test Type:** API, Database, Duplicate Data, Negative
- **Priority:** High
- **Preconditions:** Department with code `"CS"` already exists in database; logged in as `admin`.
- **Test Data:** `{ "code": "CS", "name": "Computer Science Duplicate" }`
- **Test Steps:**
  1. Send `POST /api/departments` with existing code `"CS"`.
- **Expected Result:** The API should reject duplicate department codes with a controlled error response (`409 Conflict` or `400 Bad Request`).
- **Current Implementation:** Schema defines `.unique()` on `departments.code`. Route handler in `src/routes/departments.ts` does not pre-check code uniqueness; DB unique violation triggers catch block returning `500 Internal Server Error` with `{ error: "Failed to create department" }`.
- **Recommended Behavior:** Catch DB unique violation (`code: "23505"`) or pre-query code uniqueness, returning `409 Conflict` with `{ error: "Department code already exists" }`.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-DEPT-003 — Non-Existent and Invalid Department ID
- **Test Case ID:** TC-DEPT-003
- **Module:** Departments
- **Test Type:** API, Invalid IDs, Negative, Error Handling
- **Priority:** High
- **Preconditions:** Logged in as `admin`, `teacher`, or `student`.
- **Test Data:** Invalid string ID `"abc"` and Non-existent integer ID `999999`
- **Test Steps:**
  1. Send `GET /api/departments/abc`.
  2. Send `GET /api/departments/999999`.
- **Expected Result:** `GET /api/departments/abc` returns `400 Bad Request` (`{ error: "Invalid department id" }`). `GET /api/departments/999999` returns `404 Not Found` (`{ error: "Department not found" }`).
- **Current Implementation:** `GET /api/departments/:id` in `src/routes/departments.ts` checks `Number.isFinite(departmentId)` returning `400 Bad Request` for non-numeric input, and returns `404 Not Found` if DB query returns undefined.
- **Recommended Behavior:** Matches current implementation (`400 Bad Request` for non-numeric ID, `404 Not Found` for non-existent ID).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-CLASS-001 — Cascade Delete to Enrollments
- **Test Case ID:** TC-CLASS-001
- **Module:** Classes
- **Test Type:** API, Database, Functional, Integration, Positive
- **Priority:** High
- **Preconditions:** Class has active student enrollments; logged in as `admin`.
- **Test Data:** Valid `classId`
- **Test Steps:**
  1. Send `DELETE /api/classes/:id`.
  2. Query database `enrollments` table for records associated with deleted `classId`.
- **Expected Result:** Class deleted (`200 OK`); all related `enrollments` records automatically removed via database cascade.
- **Current Implementation:** Verified in `src/db/schema/app.ts` (`enrollments.classId` references `classes.id` with `onDelete: "cascade"`). Database engine handles automatic deletion of child enrollment rows upon parent class deletion.
- **Recommended Behavior:** Matches expected specification (`200 OK` with DB cascade removal).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-SUBJ-001 — Create Subject with Non-Existent Department
- **Test Case ID:** TC-SUBJ-001
- **Module:** Subjects
- **Test Type:** API, Database, Invalid IDs, Negative
- **Priority:** High
- **Preconditions:** Logged in as `admin`.
- **Test Data:** `{ "code": "MATH101", "name": "Calculus", "departmentId": 999999 }`
- **Test Steps:**
  1. Send `POST /api/subjects` referencing non-existent `departmentId: 999999`.
- **Expected Result:** The API should reject invalid input with a controlled error response (`400 Bad Request` or `404 Not Found`).
- **Current Implementation:** Verified in `src/db/schema/app.ts` (`subjects.departmentId` references `departments.id` with `onDelete: "restrict"`). DB FK violation triggers catch block in route handler returning `500 Internal Server Error`.
- **Recommended Behavior:** Pre-verify department existence or catch FK violation (`code: "23503"`) returning `400 Bad Request` or `404 Not Found` with `{ error: "Department not found" }`.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-VALID-001 — Missing Required Field on Creation
- **Test Case ID:** TC-VALID-001
- **Module:** Departments
- **Test Type:** API, Missing Data, Validation, Boundary, Negative
- **Priority:** High
- **Preconditions:** Logged in as `admin` or `teacher`.
- **Test Data:** `{ "description": "Missing code and name" }`
- **Test Steps:**
  1. Send `POST /api/departments` with missing required fields `code` and `name`.
- **Expected Result:** The API should reject invalid input with a controlled validation error (`400 Bad Request` or `422 Unprocessable Entity`).
- **Current Implementation:** `POST /api/departments` in `src/routes/departments.ts` does not execute Zod validation middleware prior to DB insert; database NOT NULL constraint throws exception caught by try/catch block returning `500 Internal Server Error` with `{ error: "Failed to create department" }`.
- **Recommended Behavior:** Wire Zod schema validation middleware to `POST /api/departments` to validate body fields before DB insertion and return `400 Bad Request`.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-DASH-001 — Public Dashboard Metrics Access Security Check
- **Test Case ID:** TC-DASH-001
- **Module:** Dashboard / Analytics
- **Test Type:** API, Security, Authentication, Positive
- **Priority:** Medium
- **Preconditions:** None (no session cookie required).
- **Test Data:** None
- **Test Steps:**
  1. Send `GET /api/dashboard/metrics` without credentials.
  2. Verify whether the endpoint is intentionally public and whether this behavior complies with the application's security requirements.
- **Expected Result:** Verify whether the endpoint is intentionally public and whether this behavior complies with the application's security requirements. If public access is intentional, `GET /api/dashboard/metrics` should return `200 OK` with structured aggregate metrics `{ data: { userDistribution, classesByDepartment, capacityStatus, totalUsers, ... } }`.
- **Current Implementation:** Metrics route in `src/routes/stats.ts` (or `dashboard.ts`) is mounted without authentication middleware, returning aggregate system stats publicly.
- **Recommended Behavior:** Confirm product requirements regarding public vs authenticated access for analytics metrics.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-API-001 — Pagination Envelope Structure
- **Test Case ID:** TC-API-001
- **Module:** API Contract & Response Envelope
- **Test Type:** API, Functional, Positive
- **Priority:** Medium
- **Preconditions:** Database contains test records for departments; logged in as `admin` or `teacher`.
- **Test Data:** URL parameters `page=1&limit=10`
- **Test Steps:**
  1. Send `GET /api/departments?page=1&limit=10`.
- **Expected Result:** `200 OK` returning standardized response envelope `{ data: [...], pagination: { page: 1, limit: 10, total: X, totalPages: Y } }`.
- **Current Implementation:** Department list route uses pagination calculation helper returning `{ data: [...], pagination: { page, limit, total, totalPages } }`.
- **Recommended Behavior:** Matches expected specification (`200 OK` with pagination envelope).
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

### TC-SEC-001 — Unauthorized Origin CORS Request
- **Test Case ID:** TC-SEC-001
- **Module:** Security & RBAC
- **Test Type:** Security, API, Negative
- **Priority:** Medium
- **Preconditions:** API server running.
- **Test Data:** Request header `Origin: http://unauthorized-domain.com`
- **Test Steps:**
  1. Send preflight request with unauthorized `Origin` header to `GET /api/dashboard/metrics`.
- **Expected Result:** Response does not include `Access-Control-Allow-Origin: http://unauthorized-domain.com` or request is blocked by CORS policy.
- **Current Implementation:** Express CORS configuration enforces domain whitelist.
- **Recommended Behavior:** Matches expected security specification.
- **Actual Result:** Not Executed
- **Status:** Not Executed
- **Defect ID:** N/A
- **Evidence/Comments:** To be attached during execution.

---

## Step 5 — Test Environment

Use actual local configuration settings (do not expose real passwords, secrets, API keys, or database credentials):

| Component | URL / Connection |
|---|---|
| Frontend | `http://localhost:5173` (Vite dev server) |
| Backend | `http://localhost:8000` (Express server) |
| Database | Neon PostgreSQL — connection string via `DATABASE_URL` in backend `.env` |

**Test data checklist before execution:**
- [ ] **Admin Account**: `admin@example.com` / `[PLACEHOLDER_PASSWORD]` (role: `admin`)
- [ ] **Teacher Account**: `teacher1@example.com` / `[PLACEHOLDER_PASSWORD]` (role: `teacher`)
- [ ] **Student A Account**: `student1@example.com` / `[PLACEHOLDER_PASSWORD]` (role: `student`, `id: <student_a_uuid>`)
- [ ] **Student B Account**: `student2@example.com` / `[PLACEHOLDER_PASSWORD]` (role: `student`, `id: <student_b_uuid>`)
- [ ] **Department**: Code `"CS"`, Name `"Computer Science"` (`id: 1`)
- [ ] **Subject**: Code `"CS101"`, Name `"Intro to CS"`, linked to `departmentId: 1`
- [ ] **Class**: `subjectId: 1`, `teacherId: <teacher_uuid>`, `inviteCode: "CS101-SPRING"`, `capacity: 50`
- [ ] **Invite Code**: `"CS101-SPRING"` (valid active class invite code)
- [ ] **Enrollment**: `studentId: <student_a_uuid>`, `classId: 1`
- [ ] **Duplicate Data**: Duplicate email `student1@example.com`, duplicate department code `"CS"`
- [ ] **Invalid IDs**: Non-numeric string ID `"abc"`, non-existent integer ID `999999`, non-existent UUID `"00000000-0000-0000-0000-000000000000"`
- [ ] **Invalid Input**: Empty payload `{}`, payload with missing `code`/`name` fields, invalid role `"invalid_role"`

---

## Step 6 — Execution Preparation

Follow this discipline for every test case above during execution:

1. **Execute** the test case exactly as written.
2. **Record** the actual result in the "Actual Result" field and in the Test Case Execution Template — whether it matches expected or fails.
3. **Update Status** from `Not Executed` to `PASS` or `FAIL` based on execution results.
4. **If it fails or reveals a security gap** (such as TC-ENR-005/006 or unhandled DB errors), log a Defect ID using the Defect Template from the Master Test Plan §20.
5. **Fix, then retest** the same test case — verify the fix directly.
6. **Regression test** anything touching authentication, enrollment, or shared middleware after any fix (refer to Master Test Plan §24 for the full regression trigger list).

The two test cases most critical for security verification are **TC-ENR-005 and TC-ENR-006** — the codebase audit found no ownership check, so verify authorization logic thoroughly during execution.

---

## Test Case Execution Template

| Test Case ID | Actual Result | Status | Defect ID | Evidence |
|--------------|---------------|--------|-----------|----------|
| TC-LOGIN-001 | Not Executed | Not Executed | N/A | |
| TC-LOGIN-002 | Not Executed | Not Executed | N/A | |
| TC-LOGIN-003 | Not Executed | Not Executed | N/A | |
| TC-REG-001 | Not Executed | Not Executed | N/A | |
| TC-AUTH-001 | Not Executed | Not Executed | N/A | |
| TC-AUTH-002 | Not Executed | Not Executed | N/A | |
| TC-ENR-001 | Not Executed | Not Executed | N/A | |
| TC-ENR-002 | Not Executed | Not Executed | N/A | |
| TC-ENR-003 | Not Executed | Not Executed | N/A | |
| TC-ENR-004 | Not Executed | Not Executed | N/A | |
| TC-ENR-005 | Not Executed | Not Executed | N/A | |
| TC-ENR-006 | Not Executed | Not Executed | N/A | |
| TC-DEPT-001 | Not Executed | Not Executed | N/A | |
| TC-DEPT-002 | Not Executed | Not Executed | N/A | |
| TC-DEPT-003 | Not Executed | Not Executed | N/A | |
| TC-CLASS-001 | Not Executed | Not Executed | N/A | |
| TC-SUBJ-001 | Not Executed | Not Executed | N/A | |
| TC-VALID-001 | Not Executed | Not Executed | N/A | |
| TC-DASH-001 | Not Executed | Not Executed | N/A | |
| TC-API-001 | Not Executed | Not Executed | N/A | |
| TC-SEC-001 | Not Executed | Not Executed | N/A | |

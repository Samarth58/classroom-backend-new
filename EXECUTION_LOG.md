# QA Test Execution Log — Classroom Management System

## TC-LOGIN-001 — Valid Login

**Timestamp:** 2026-08-21T20:42:33+05:30  
**Target URL:** `http://localhost:8000/api/auth/sign-in/email`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"Password123!"}' \
  -c logs/student1-cookie.txt
```

**Raw Output (`logs/TC-LOGIN-001.log`):**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
* Connected to localhost (127.0.0.1) port 8000
> POST /api/auth/sign-in/email HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 58
> 
{"email":"student1@example.com","password":"Password123!"}
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< content-type: application/json
< set-cookie: better-auth.session_token=sYw6HwKjjI7yGoEMakjwbyF2wWhjhUtA.ihixAyUlz4X%2BGmvL6KQFZIIrOih40g5cSdvP2Fb9rg4%3D; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax
< Date: Fri, 21 Aug 2026 15:12:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
< 
{"redirect":false,"token":"sYw6HwKjjI7yGoEMakjwbyF2wWhjhUtA","user":{"name":"Student One","email":"student1@example.com","emailVerified":false,"image":null,"createdAt":"2026-08-21T15:11:50.561Z","updatedAt":"2026-08-21T15:11:50.561Z","role":"student","imageCldPubId":null,"id":"mqFdl6ifg2xQrOcCTwRkXS1iIOHCvKz7"}}
```

**Expected:** 200 OK; response payload contains `{ user: { id, email, name, role } }`; `Set-Cookie: better-auth.session_token=...; HttpOnly` header present.  
**Actual:** HTTP 200 OK; set-cookie header present; returned user object for student1@example.com.  
**Status:** PASS  
**Defect:** None.

---

## TC-LOGIN-002 — Invalid Password

**Timestamp:** 2026-08-21T20:40:07+05:30  
**Target URL:** `http://localhost:8000/api/auth/sign-in/email`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"WrongPassword!"}'
```

**Raw Output (`logs/TC-LOGIN-002.log`):**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
* Connected to localhost (127.0.0.1) port 8000
> POST /api/auth/sign-in/email HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 60
> 
{"email":"student1@example.com","password":"WrongPassword!"}
< HTTP/1.1 401 Unauthorized
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< content-type: application/json
< Date: Fri, 21 Aug 2026 15:10:07 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
< 
{"message":"Invalid email or password","code":"INVALID_EMAIL_OR_PASSWORD"}
```

**Expected:** 401 Unauthorized; no Set-Cookie session header issued.  
**Actual:** HTTP 401 Unauthorized; `{"message":"Invalid email or password","code":"INVALID_EMAIL_OR_PASSWORD"}`.  
**Status:** PASS  
**Defect:** None.

---

## TC-LOGIN-003 — Missing Email Field

**Timestamp:** 2026-08-21T20:41:08+05:30  
**Target URL:** `http://localhost:8000/api/auth/sign-in/email`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"password":"Password123!"}'
```

**Raw Output (`logs/TC-LOGIN-003.log`):**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
* Connected to localhost (127.0.0.1) port 8000
> POST /api/auth/sign-in/email HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 27
> 
{"password":"Password123!"}
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< content-type: application/json
< Date: Fri, 21 Aug 2026 15:11:08 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
< 
{"message":"[body.email] Invalid input: expected string, received undefined","code":"VALIDATION_ERROR"}
```

**Expected:** The API should reject invalid input with a controlled validation error (400 Bad Request or 422 Unprocessable Entity).  
**Actual:** HTTP 400 Bad Request; `{"message":"[body.email] Invalid input: expected string, received undefined","code":"VALIDATION_ERROR"}`.  
**Status:** PASS  
**Defect:** None.

---

## TC-REG-001 — Duplicate Email Registration

**Timestamp:** 2026-08-21T20:42:06+05:30  
**Target URL:** `http://localhost:8000/api/auth/sign-up/email`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"Password123!","name":"Duplicate Student","role":"student"}'
```

**Raw Output (`logs/TC-REG-001.log`):**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
* Connected to localhost (127.0.0.1) port 8000
> POST /api/auth/sign-up/email HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 102
> 
{"email":"student1@example.com","password":"Password123!","name":"Duplicate Student","role":"student"}
< HTTP/1.1 422 Unprocessable Entity
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< content-type: application/json
< Date: Fri, 21 Aug 2026 15:12:06 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
< 
{"message":"User already exists. Use another email.","code":"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"}
```

**Expected:** The API should reject duplicate email registration with a controlled error response (422 Unprocessable Entity or 409 Conflict); no new user row created.  
**Actual:** HTTP 422 Unprocessable Entity; `{"message":"User already exists. Use another email.","code":"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"}`.  
**Status:** PASS  
**Defect:** None.

---

## TC-AUTH-001 — Unauthenticated Mutation Access

**Timestamp:** 2026-08-21T22:41:00+05:30  
**Target URL:** `http://localhost:8000/api/departments`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"code":"CS","name":"Computer Science"}'
```

**Raw Output:**
```http
> POST /api/departments HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 42
> 
* Request completely sent off
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 39
< ETag: W/"27-qO2Vu9diK5KVqnJKo+PT0wb+EMA"
< Date: Fri, 21 Aug 2026 17:11:00 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"error":"Failed to create department"}
```

**Expected:** `401 Unauthorized` with structured error payload `{ error: "Unauthorized" }`.  
**Actual:** HTTP 500 Internal Server Error (`{"error":"Failed to create department"}`). Request reached DB operation without authentication check.  
**Status:** FAIL  
**Defect:** DEFECT-AUTH-001: Route `POST /api/departments` lacks authentication middleware check, allowing unauthenticated requests to reach database operations.

---

## TC-AUTH-002 — Role-Forbidden Mutation

**Timestamp:** 2026-08-21T22:41:28+05:30  
**Target URL:** `http://localhost:8000/api/departments`  
**Logged-in Session Proof:** `{"token":"sYRBcxBzule...","user":{"id":"mqFdl6ifg2x...","role":"student"}}`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/departments \
  -H "Content-Type: application/json" \
  -b logs/student1-cookie.txt \
  -d '{"name":"Forbidden Department","code":"FORB"}'
```

**Raw Output:**
```http
> POST /api/departments HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=sYRBcxBzuleZCSvwQU8B05tZN2EQfZHR.9e2J2mGBExIQyuGJPmQf565gcSGd9FC6%2BV4NenCkNBU%3D
> Content-Type: application/json
> Content-Length: 48
> 
* Request completely sent off
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 17
< ETag: W/"11-NFmdOSt3cRVDHCIYuMZDzblgNXc"
< Date: Fri, 21 Aug 2026 17:11:28 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"data":{"id":9}}
```

**Expected:** `403 Forbidden` with structured error payload `{ error: "Forbidden" }`.  
**Actual:** HTTP 201 Created (`{"data":{"id":9}}`). Department created successfully by a student user.  
**Status:** FAIL  
**Defect:** DEFECT-AUTH-002: Route `POST /api/departments` lacks RBAC role authorization check, allowing users with `student` role to create departments.

---

## TC-DEPT-001 — Restrict Delete with Active Subjects

**Timestamp:** 2026-08-21T20:56:15+05:30  
**Target URL:** `http://localhost:8000/api/departments/1`  
**Command Executed:**
```bash
curl -v -X DELETE http://localhost:8000/api/departments/1 \
  -b logs/admin-cookie.txt
```

**Raw Output (`logs/TC-DEPT-001.log`):**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
* Connected to localhost (127.0.0.1) port 8000
> DELETE /api/departments/1 HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=zjHYLXA2yz5vK91kyyL3ODV3abhTJDvX.nKmQY7sNADZ8X76fuvD4ebR5aUPc9T9463zhCtJBiI4%3D
* Request completely sent off
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Security-Policy: default-src 'none'
< X-Content-Type-Options: nosniff
< Content-Type: text/html; charset=utf-8
< Content-Length: 159
< Date: Fri, 21 Aug 2026 16:48:50 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot DELETE /api/departments/1</pre>
</body>
</html>
```

**Expected:** The API should prevent deletion and return a controlled error response (400 Bad Request or 409 Conflict) indicating active subjects exist.  
**Actual:** HTTP 404 Not Found (`Cannot DELETE /api/departments/1`). Code search on `src/routes/departments.ts` confirms no `DELETE` route exists in `departments.ts` (`router.delete` count: 0).  
**Status:** FAIL  
**Defect:** DEFECT-DEPT-001: DELETE /api/departments/:id route is missing in src/routes/departments.ts, returning HTTP 404 Not Found.

---

## TC-DEPT-002 — Duplicate Department Code

**Timestamp:** 2026-08-21T20:58:59+05:30  
**Target URL:** `http://localhost:8000/api/departments`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"code":"CS","name":"Computer Science Duplicate"}' \
  -b logs/admin-cookie.txt
```

**Raw Output (`logs/TC-DEPT-002.log`):**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
* Connected to localhost (127.0.0.1) port 8000
> POST /api/departments HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=jJCmWQDca0SJzPZ9S1WcNCiXS6wZ0V77.bHezClW9sX3QRammKR2M%2FBUEIJ5x1jS23b6UKT5BvJ8%3D
> Content-Type: application/json
> Content-Length: 49
> 
{"code":"CS","name":"Computer Science Duplicate"}
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 33
< ETag: W/"21-Fau8GdrOCOyGNNH/IiTxy2DuMu0"
< Date: Fri, 21 Aug 2026 15:28:59 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"error":"Internal Server Error"}
```

**Expected:** Controlled duplicate error response (409 Conflict or 400 Bad Request) with `{ error: "Department code already exists" }`.  
**Actual:** HTTP 500 Internal Server Error; `{"error":"Internal Server Error"}` uncaught DB exception.  
**Status:** FAIL  
**Defect:** DEFECT-DEPT-002: Uncaught DB unique constraint violation returns 500 Internal Server Error on duplicate department code instead of controlled 409 Conflict error.

---

## TC-DEPT-003 — Non-Numeric and Non-Existent Department IDs

**Timestamp:** 2026-08-21T20:59:54+05:30  
**Target URL:** `http://localhost:8000/api/departments/abc` and `http://localhost:8000/api/departments/999999`  
**Command Executed:**
```bash
curl -v http://localhost:8000/api/departments/abc -b logs/student1-cookie.txt
curl -v http://localhost:8000/api/departments/999999 -b logs/student1-cookie.txt
```

**Raw Output (`logs/TC-DEPT-003.log`):**
```http
> GET /api/departments/abc HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=y0YjDFiXsz7c44UXHL3bqAsdi7vTul48.ox99wQCvIxVAM%2BDmwZZsbmtJ%2F8NdDdvBnz1VCpxako4%3D
> 
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 22
< ETag: W/"16-n3Xa9o2UYcMPQVvhmuzHPYV5wr0"
< Date: Fri, 21 Aug 2026 15:29:52 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"error":"Invalid ID"}

> GET /api/departments/999999 HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=y0YjDFiXsz7c44UXHL3bqAsdi7vTul48.ox99wQCvIxVAM%2BDmwZZsbmtJ%2F8NdDdvBnz1VCpxako4%3D
> 
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 31
< ETag: W/"1f-5dSdOJyc2ImybP4KGAxE/O6c76A"
< Date: Fri, 21 Aug 2026 15:29:54 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"error":"No Department Found"}
```

**Expected:** Non-numeric ID returns 400 Bad Request; non-existent ID returns 404 Not Found.  
**Actual:** `GET /departments/abc` returned HTTP 400 Bad Request (`{"error":"Invalid ID"}`); `GET /departments/999999` returned HTTP 404 Not Found (`{"error":"No Department Found"}`).  
**Status:** PASS  
**Defect:** None.

---

## TC-ENR-005 — Cross-Student Enrollment Security Violation (ID Bypassing)

**Timestamp:** 2026-08-21T22:24:26+05:30  
**Target URL:** `http://localhost:8000/api/enrollments`  
**Logged-in User:** Student A (`role: "student"`, `id: "mqFdl6ifg2xQrOcCTwRkXS1iIOHCvKz7"`, session token: `sYRBcxBzuleZCSvwQU8B05tZN2EQfZHR...`)  
**Target Enrollment Payload:** `{ "classId": 2, "studentId": "qgGxShQkdl1eWQH1WWobiQRUUQvx55o1" }` (Student B)  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/enrollments \
  -H "Content-Type: application/json" \
  -b logs/student1-cookie.txt \
  -d '{"classId": 2, "studentId": "qgGxShQkdl1eWQH1WWobiQRUUQvx55o1"}'
```

**Raw Output:**
```http
> POST /api/enrollments HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=sYRBcxBzuleZCSvwQU8B05tZN2EQfZHR.9e2J2mGBExIQyuGJPmQf565gcSGd9FC6%2BV4NenCkNBU%3D
> Content-Type: application/json
> Content-Length: 63
> 
* Request completely sent off
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 1186
< ETag: W/"4a2-nxBkDf2g9J/gvKyhM895adutRmU"
< Date: Fri, 21 Aug 2026 16:54:26 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"data":{"id":9,"studentId":"qgGxShQkdl1eWQH1WWobiQRUUQvx55o1","classId":2,"createdAt":"2026-08-21T16:54:25.471Z","updatedAt":"2026-08-21T16:54:25.471Z","class":{"id":2,"subjectId":14,"teacherId":"NndwTFI6YFoX87razlhtHTVvVisUWV4c","inviteCode":"6i5ejxn","name":"Networks","bannerCldPubId":"uploads/b4tq7tl6uo1kavplhtdp","bannerUrl":"https://res.cloudinary.com/yu0fmd0n/image/upload/v1783492080/uploads/b4tq7tl6uo1kavplhtdp.jpg","capacity":10,"description":"Computer networks","status":"active","schedules":[],"createdAt":"2026-07-08T06:28:31.373Z","updatedAt":"2026-07-08T06:28:31.373Z"},"subject":{"id":14,"departmentId":3,"name":"Signals","code":"ECE101","description":"Analysis of EC","createdAt":"2026-07-04T08:04:30.557Z","updatedAt":"2026-07-04T08:04:30.557Z"},"department":{"id":3,"code":"CS","name":"Computer Science","description":"CS Department","createdAt":"2026-07-04T07:56:13.048Z","updatedAt":"2026-07-04T07:56:13.048Z"},"teacher":{"id":"NndwTFI6YFoX87razlhtHTVvVisUWV4c","name":"Teacher tom","email":"tom@example.com","emailVerified":false,"image":null,"role":"teacher","imageCldPubId":null,"createdAt":"2026-07-06T17:00:55.043Z","updatedAt":"2026-07-06T17:00:55.043Z"}}}
```

**Expected:** `403 Forbidden` with `{ error: "Cannot enroll another user" }`.  
**Actual:** HTTP 201 Created. `POST /api/enrollments` accepted arbitrary `studentId` from request body without checking authenticated user session identity (`req.user`), allowing Student A to enroll Student B.  
**Status:** FAIL  
**Defect:** DEFECT-ENR-005: `POST /api/enrollments` and `POST /api/enrollments/join` fail to enforce session ownership, allowing logged-in students to create enrollments for arbitrary user IDs.

---

## TC-ENR-006 — Unauthorized Enrollment Removal / Unimplemented Endpoint

**Timestamp:** 2026-08-21T22:24:31+05:30  
**Target URL:** `http://localhost:8000/api/enrollments/8`  
**Logged-in User:** Student A (`role: "student"`, `id: "mqFdl6ifg2xQrOcCTwRkXS1iIOHCvKz7"`)  
**Target Enrollment ID:** `8` (belongs to Student B: `qgGxShQkdl1eWQH1WWobiQRUUQvx55o1`)  
**Command Executed:**
```bash
curl -v -X DELETE http://localhost:8000/api/enrollments/8 \
  -b logs/student1-cookie.txt
```

**Raw Output:**
```http
> DELETE /api/enrollments/8 HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=sYRBcxBzuleZCSvwQU8B05tZN2EQfZHR.9e2J2mGBExIQyuGJPmQf565gcSGd9FC6%2BV4NenCkNBU%3D
> 
* Request completely sent off
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Security-Policy: default-src 'none'
< X-Content-Type-Options: nosniff
< Content-Type: text/html; charset=utf-8
< Content-Length: 159
< Date: Fri, 21 Aug 2026 16:54:31 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot DELETE /api/enrollments/8</pre>
</body>
</html>
```

**Expected:** Authorization check rejects unauthorized deletion with `403 Forbidden`.  
**Actual:** HTTP 404 Not Found (`Cannot DELETE /api/enrollments/8`). Code audit of `src/routes/enrollments.ts` confirms `DELETE /api/enrollments/:id` route handler is not implemented.  
**Status:** FAIL  
**Defect:** DEFECT-ENR-006: `DELETE /api/enrollments/:id` route handler is missing in `src/routes/enrollments.ts`, returning HTTP 404 Not Found.

---

## TC-DASH-001 — Unauthenticated System Metrics Access

**Timestamp:** 2026-08-21T22:32:50+05:30  
**Target URL:** `http://localhost:8000/api/stats/overview`  
**Command Executed:**
```bash
curl -v http://localhost:8000/api/stats/overview
```

**Raw Output:**
```http
> GET /api/stats/overview HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 98
< ETag: W/"62-XyXNkgW9AbO0uXZlw4E7pTXIUCc"
< Date: Fri, 21 Aug 2026 17:02:50 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"data":{"users":"11","teachers":"3","admins":"1","subjects":"4","departments":"3","classes":"6"}}
```

**Expected:** Protected metrics endpoint requires authentication/admin permissions.  
**Actual:** HTTP 200 OK. Route `/api/stats/overview` is completely unauthenticated, exposing system user and department counts to anonymous callers.  
**Status:** FAIL  
**Defect:** DEFECT-DASH-001: `/api/stats/*` routes are unauthenticated, exposing core system metrics to unauthenticated requests.

---

## TC-SEC-001 — CORS Origin Restriction Enforcement

**Timestamp:** 2026-08-21T22:35:08+05:30  
**Target URL:** `http://localhost:8000/api/stats/overview`  
**Command Executed:**
```bash
curl -v -H "Origin: http://unauthorized-domain.com" http://localhost:8000/api/stats/overview
curl -v -X OPTIONS http://localhost:8000/api/stats/overview -H "Origin: http://unauthorized-domain.com" -H "Access-Control-Request-Method: GET"
```

**Raw Output:**
```http
> GET /api/stats/overview HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Origin: http://unauthorized-domain.com
> 
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 98
```

**Expected:** `Access-Control-Allow-Origin` header must strictly match allowed frontend domain (`http://localhost:5173`) and NOT mirror unauthorized origins.  
**Actual:** Response contains static header `Access-Control-Allow-Origin: http://localhost:5173`. Browsers enforce CORS and reject cross-origin access from unauthorized origins.  
**Status:** PASS  
**Defect:** None.

---

## TC-VAL-001 — Payload Validation Handling

**Timestamp:** 2026-08-21T22:37:04+05:30  
**Target URL:** `http://localhost:8000/api/departments`  
**Command Executed:**
```bash
curl -v -X POST http://localhost:8000/api/departments \
  -H "Content-Type: application/json" \
  -b logs/admin-cookie.txt \
  -d '{"description": "Missing code and name"}'
```

**Raw Output:**
```http
> POST /api/departments HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=60DlaU7A...
> Content-Type: application/json
> Content-Length: 40
> 
* Request completely sent off
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 39
< ETag: W/"27-qO2Vu9diK5KVqnJKo+PT0wb+EMA"
< Date: Fri, 21 Aug 2026 17:07:04 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{"error":"Failed to create department"}
```

**Expected:** Controlled input validation error (`400 Bad Request` or `422 Unprocessable Entity`) indicating missing required fields (`code`, `name`).  
**Actual:** HTTP 500 Internal Server Error (`{"error":"Failed to create department"}`). Handler lacks request schema validation, allowing invalid payload to crash DB query into catch block.  
**Status:** FAIL  
**Defect:** DEFECT-VAL-001: Route `POST /api/departments` lacks input payload schema validation, triggering unhandled DB exceptions and returning HTTP 500 Internal Server Error on missing required fields.

---

## TC-SUBJ-002 — POST /api/subjects Auth Guard Check (Scenario A: No Cookie)

**Timestamp:** 2026-08-24T17:35:36+05:30  
**Target URL:** `http://localhost:8000/api/subjects`  
**Command Executed:**
```bash
curl.exe -v -X POST http://localhost:8000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"code":"SUBJTEST","name":"Subject Test","departmentId":2}'
```

**Raw Output:**
```http
Note: Unnecessary use of -X or --request, POST is already inferred.
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8000...
* Connected to localhost (::1) port 8000
* using HTTP/1.x
> POST /api/subjects HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 67
>
} [67 bytes data]
* upload completely sent off: 67 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 18
< ETag: W/"12-jdxeNbgzc5HEnctvTUz1+YYIDrY"
< Date: Mon, 24 Aug 2026 12:08:26 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"data":{"id":21}}
```

**Expected:** `401 Unauthorized` — request without session cookie should be rejected before reaching the route handler.  
**Actual:** `201 Created` (`{"data":{"id":21}}`). Request reached route handler and successfully inserted subject into DB without any session authentication.  
**Status:** FAIL  
**Defect:** DEFECT-SUBJ-002A: Route `POST /api/subjects` has no authentication middleware — unauthenticated requests bypass auth entirely and are processed by the handler.

---

## TC-SUBJ-002 — POST /api/subjects Auth Guard Check (Scenario B: Student Cookie)

**Timestamp:** 2026-08-24T17:41:47+05:30  
**Target URL:** `http://localhost:8000/api/subjects`  
**Command Executed:**
```bash
curl.exe -v -b student-cookies.txt http://localhost:8000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"code":"SUBJTEST-STU","name":"Subject Test Student","departmentId":2}'
```

**Raw Output:**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8000...
* Connected to localhost (::1) port 8000
* using HTTP/1.x
> POST /api/subjects HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=Xy4vxjto5uxgJUUTXBFOYZDSid5eawNn.yQqVlFgMhtu1CDUG6OothfARF2a1J6vtgxb6%2B1pWqak%3D
> Content-Type: application/json
> Content-Length: 73
>
} [73 bytes data]
* upload completely sent off: 73 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 18
< ETag: W/"12-N4YZGR+5cuKkjZetLywu5LbLSd8"
< Date: Mon, 24 Aug 2026 12:11:52 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"data":{"id":24}}
```

**Expected:** `403 Forbidden` — session cookie with `role: "student"` should be rejected by RBAC middleware before subject creation proceeds.  
**Actual:** `201 Created` (`{"data":{"id":24}}`). Student session cookie (`role: "student"`, `id: "mqFdl6ifg2xQrOcCTwRkXS1iIOHCvKz7"`) was accepted and subject inserted into DB without any role authorization check.  
**Status:** FAIL  
**Defect:** DEFECT-SUBJ-002B: Route `POST /api/subjects` has no RBAC authorization middleware — student-role sessions can create subjects, which should be restricted to `admin`/`teacher` roles only.

---

## TC-CLASS-002 — POST /api/classes Auth Guard Check (Scenario A: No Cookie)

**Timestamp:** 2026-08-24T17:41:59+05:30  
**Target URL:** `http://localhost:8000/api/classes`  
**Command Executed:**
```bash
curl.exe -v http://localhost:8000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Physics 202","subjectId":18,"teacherId":"i7hZl4BPZmv8M9mcaTB81yC4wqTmEyfW","inviteCode":"PHYS202","capacity":30}'
```

**Raw Output:**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8000...
* Connected to localhost (::1) port 8000
* using HTTP/1.x
> POST /api/classes HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 136
>
} [136 bytes data]
* upload completely sent off: 136 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 17
< ETag: W/"11-pp9xJ5ut3Q4XE3Cnj/YbjR17mAc"
< Date: Mon, 24 Aug 2026 12:12:02 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"data":{"id":8}}
```

**Expected:** `401 Unauthorized` — request without session cookie should be rejected before reaching the route handler.  
**Actual:** `201 Created` (`{"data":{"id":8}}`). Request reached route handler and successfully inserted a class record into DB without any session authentication.  
**Status:** FAIL  
**Defect:** DEFECT-CLASS-002A: Route `POST /api/classes` has no authentication middleware — unauthenticated requests bypass auth entirely and are processed by the handler.

---

## TC-CLASS-002 — POST /api/classes Auth Guard Check (Scenario B: Student Cookie)

**Timestamp:** 2026-08-24T17:42:19+05:30  
**Target URL:** `http://localhost:8000/api/classes`  
**Command Executed:**
```bash
curl.exe -v -b student-cookies.txt http://localhost:8000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"Physics 303","subjectId":18,"teacherId":"i7hZl4BPZmv8M9mcaTB81yC4wqTmEyfW","inviteCode":"PHYS303-STU","capacity":30}'
```

**Raw Output:**
```http
* Host localhost:8000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8000...
* Connected to localhost (::1) port 8000
* using HTTP/1.x
> POST /api/classes HTTP/1.1
> Host: localhost:8000
> User-Agent: curl/8.13.0
> Accept: */*
> Cookie: better-auth.session_token=Xy4vxjto5uxgJUUTXBFOYZDSid5eawNn.yQqVlFgMhtu1CDUG6OothfARF2a1J6vtgxb6%2B1pWqak%3D
> Content-Type: application/json
> Content-Length: 128
>
} [128 bytes data]
* upload completely sent off: 128 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:5173
< Vary: Origin
< Access-Control-Allow-Credentials: true
< Content-Type: application/json; charset=utf-8
< Content-Length: 17
< ETag: W/"11-NFmdOSt3cRVDHCIYuMZDzblgNXc"
< Date: Mon, 24 Aug 2026 12:12:26 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"data":{"id":9}}
```

**Expected:** `403 Forbidden` — session cookie with `role: "student"` should be rejected by RBAC middleware before class creation proceeds.  
**Actual:** `201 Created` (`{"data":{"id":9}}`). Student session cookie (`role: "student"`, `id: "mqFdl6ifg2xQrOcCTwRkXS1iIOHCvKz7"`) was accepted and class inserted into DB without any role authorization check.  
**Status:** FAIL  
**Defect:** DEFECT-CLASS-002B: Route `POST /api/classes` has no RBAC authorization middleware — student-role sessions can create classes, which should be restricted to `admin`/`teacher` roles only.


---

## Final Full-Suite Retest — 2026-08-25

**Runner:** scratch/run-full-suite.ps1 (fully self-contained, run-scoped test data)  
**Result: 50 / 50 PASS — 0 defects remaining**

All 22 defects (DEFECT-AUTH-001/002/003, DEFECT-DEPT-001/002/007, DEFECT-SUBJ-004/005/006/007, DEFECT-CLASS-003/006/007/008, DEFECT-ENR-003/005/006/007, DEFECT-VAL-001/002/003, DEFECT-API-001) are fixed and verified green.

| TC ID | Name | Expected | Actual | Result |
|-------|------|----------|--------|--------|
| TC-AUTH-001 | User Registration | 200 | 200 | PASS |
| TC-AUTH-002 | User Login | 200 | 200 | PASS |
| TC-AUTH-003 | Invalid Login Credentials | 401 | 401 | PASS |
| TC-AUTH-004 | User Logout without Origin Header | 200 | 200 | PASS |
| TC-AUTH-005 | Get User List (RBAC) | 200 | 200 | PASS |
| TC-AUTH-006 | Duplicate Email Signup | 422 | 422 | PASS |
| TC-AUTH-007 | Default Role Registration | 200 | 200 | PASS |
| TC-DEPT-001 | Create Department (Admin) | 201 | 201 | PASS |
| TC-DEPT-002 | List Departments with Pagination | 200 | 200 | PASS |
| TC-DEPT-003 | Search Departments | 200 | 200 | PASS |
| TC-DEPT-004 | Update Department (PATCH) | 200 | 200 | PASS |
| TC-DEPT-005 | Delete Restricted Department | 400 | 400 | PASS |
| TC-DEPT-006 | Get Department Details and Totals | 200 | 200 | PASS |
| TC-DEPT-007 | List Department Subjects | 200 | 200 | PASS |
| TC-DEPT-008 | List Department Classes | 200 | 200 | PASS |
| TC-SUBJ-001 | Create Subject (Admin) | 201 | 201 | PASS |
| TC-SUBJ-002 | List Subjects Filtered by Department | 200 | 200 | PASS |
| TC-SUBJ-003 | Update Subject (PATCH) | 200 | 200 | PASS |
| TC-SUBJ-004 | Delete Subject | 200 | 200 | PASS |
| TC-SUBJ-005 | Create Subject Non-existent DepartmentId | 400 | 400 | PASS |
| TC-SUBJ-006 | Create Subject Duplicate Code | 409 | 409 | PASS |
| TC-SUBJ-007 | Get Subject Details and Totals | 200 | 200 | PASS |
| TC-CLASS-001 | Create Class with Auto InviteCode | 201 | 201 | PASS |
| TC-CLASS-002 | List Classes Filtered by Subject | 200 | 200 | PASS |
| TC-CLASS-003 | Get Class Details | 200 | 200 | PASS |
| TC-CLASS-004 | Update Class (PATCH) | 200 | 200 | PASS |
| TC-CLASS-005 | Delete Class | 200 | 200 | PASS |
| TC-CLASS-006 | Join Full Capacity Class | 400 | 400 | PASS |
| TC-CLASS-007 | Create Class Non-existent Subject/Teacher | 400 | 400 | PASS |
| TC-ENR-001 | Student Self Enrollment | 201 | 201 | PASS |
| TC-ENR-002 | Join Class by Invite Code | 201 | 201 | PASS |
| TC-ENR-003 | List User Enrollments | 200 | 200 | PASS |
| TC-ENR-004 | List Class Enrollments / Users | 200 | 200 | PASS |
| TC-ENR-005 | Delete Student Enrollment | 200 | 200 | PASS |
| TC-ENR-006 | Duplicate Enrollment Prevention | 409 | 409 | PASS |
| TC-ENR-007 | Join Class Invalid Invite Code | 404 | 404 | PASS |
| TC-ENR-008 | Admin Enroll Student on Behalf | 201 | 201 | PASS |
| TC-DASH-001 | Dashboard Overview Metrics (Auth) | 200 | 200 | PASS |
| TC-DASH-002 | Dashboard Latest Activities (Auth) | 200 | 200 | PASS |
| TC-DASH-003 | Dashboard Chart Data (Auth) | 200 | 200 | PASS |
| TC-API-001 | Pagination Envelope Schema | 200 | 200 | PASS |
| TC-API-002 | Empty Search Results Array Format | 200 | 200 | PASS |
| TC-API-003 | Invalid Numeric ID Handling | 400 | 400 | PASS |
| TC-API-004 | Non-existent Resource ID Handling | 404 | 404 | PASS |
| TC-SEC-001 | CORS Origin Enforcement | 200 | 200 | PASS |
| TC-SEC-002 | Cascade Delete Verification | 200 | 200 | PASS |
| TC-SEC-003 | Unauthenticated POST Rejection | 401 | 401 | PASS |
| TC-SEC-004 | Student Role POST Rejection (403) | 403 | 403 | PASS |
| TC-SEC-005 | Cross-Student Enrollment Attack (403) | 403 | 403 | PASS |
| DEFECT-API-001 | Global Error Handler JSON SyntaxError | 400 | 400 | PASS |

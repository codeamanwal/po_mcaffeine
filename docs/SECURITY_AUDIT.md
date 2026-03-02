# Security Audit Report

This document outlines security vulnerabilities identified during the code audit.

## Critical Vulnerabilities

### 1. Unprotected Admin Creation
- **File**: `backend/src/controllers/admin.controllers.js`
- **Function**: `createAdmin`
- **Route**: `POST /api/v1/admin/create-admin`
- **Issue**: This endpoint allows the creation of a user with `role: "admin"` and `permissions: ["all"]` without any authentication or authorization checks.
- **Impact**: Any unauthenticated attacker can create a super-admin account and take full control of the system.
- **Remediation**: Remove this endpoint immediately if it was for development only. If needed, protect it with a hardcoded secret key or require `SuperAdminMiddleware` (and bootstrap the first admin via database seeds).

## High Priority Issues

### 2. Broken Middleware Chain in Admin Routes
- **File**: `backend/src/routes/admin.routes.js`
- **Issue**: The `adminRouter` is mounted in `index.js` **without** `AuthMiddleware`. However, routes like `/create-warehouse` use `AdminMiddleware`.
- **Detail**: `AdminMiddleware` expects `req.user` to be populated (usually by `AuthMiddleware`). Since `AuthMiddleware` is skipped, `req.user` is undefined, causing the server to crash (500 Internal Server Error) when `AdminMiddleware` attempts to access `req.user.role`.
- **Impact**: While this accidentally prevents unauthorized access (by crashing), it is a denial-of-service vector and indicates broken logic.
- **Remediation**: Mount `adminRouter` with `AuthMiddleware` in `index.js`, or apply `AuthMiddleware` before `AdminMiddleware` in the route definitions.

## Medium Priority Issues

### 3. Inconsistent Authorization Logic
- **File**: `backend/src/controllers/admin.controllers.js`
- **Functions**: `createWareHouse`, `createLogistic`
- **Issue**: These controllers manually parse `req.headers.authorization` to verify tokens, instead of relying on the standardized `AuthMiddleware`.
- **Impact**: Increases maintenance burden and risk of implementation errors (e.g., handling missing headers, different token formats).
- **Remediation**: Refactor to use `AuthMiddleware` globally.

## Targeted Controller Audit Findings

### 4. Public Forgot Password Vulnerability (Critical)
- **File**: `backend/src/controllers/mail.controllers.js`
- **Function**: `sendForgotPasswordMail`
- **Issues**:
  - **No Authentication**: The route is publicly accessible.
  - **Weak Security**: Uses `Math.random()` for password generation (not cryptographically secure).
  - **DoS Vector**: Immediately **changes** the user's password to the random value before the user confirms receipt of the email. An attacker can lock out any user by spamming this endpoint with their email.
  - **No Rate Limiting**: Vulnerable to email spamming.
- **Remediation**: Implement a token-based reset flow (send link with token, verify token, then reset). Use a secure random generator. Add rate limiting.

### 5. Master Data Privilege Escalation (Critical)
- **File**: `backend/src/controllers/master.controllers.js`
- **Functions**: `uploadMasterSheet`, `deleteMasterSheet`
- **Issue**: These functions rely solely on `AuthMiddleware` (which only checks if a user is logged in). There are **no role checks**.
- **Impact**: Any authenticated user (Warehouse, Logistics) can **delete all master data** (`destroy({ truncate: true })`) or overwrite it.
- **Remediation**: Add `SuperAdminMiddleware` or explicit role checks (`if (req.user.role !== 'admin') ...`) at the start of these functions.

### 6. Shipment Access Control Flaws (High)
- **File**: `backend/src/controllers/shipment.controller.js`
- **Functions**: `updateShipment`, `deleteShipment`, `createShipment`
- **Issue**:
  - `updateShipment`: Allows any authenticated user to update distinct fields of a shipment. While `updateBulkShipment` has robust role checks, the single update function does not.
  - `deleteShipment`: Allows any authenticated user to delete a shipment and its SKUs.
- **Impact**: Warehouse/Logistics users could modify or delete shipments they shouldn't have access to (or modify fields restricted to Planners).
- **Remediation**: Implement the same field-level and role-level restrictions found in `updateBulkShipment` for the single update function. restrict `deleteShipment` to Admins only.

### 7. File Upload/Download Security
- **File**: `backend/src/controllers/file.controllers.js`
- **Function**: `getS3UploadUrl`
- **Issue**: Does not validate file types or extensions in the controller.
- **Impact**: If not restricted in `utils/s3.js` (not checked), users might upload malicious file types.
- **Remediation**: Validate `fileType` query parameter against an allowlist (e.g., `text/csv`, `application/pdf`, `image/*`) before generating the signed URL.

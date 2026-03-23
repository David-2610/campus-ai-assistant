# Software Requirements Specification (SRS)
## Campus AI Assistant Mobile Application

### 1. Introduction
**1.1 Purpose**
The purpose of this document is to outline the software requirements for the Mobile Application version of the "Campus AI Assistant." This document will guide the mobile development team (e.g., React Native developers) in understanding the backend capabilities, user roles, core features, and data constraints.

**1.2 Scope**
The Campus AI Assistant mobile application will serve as a centralized hub for students and administrators to share academic resources, view campus notices, and manage campus-related operations. The mobile application will consume the existing NodeJS/ExpressRESTful API.

### 2. Overall Description
**2.1 User Roles**
- **Student (User):** Can register, log in, view public resources, upload resources, report inappropriate resources, and view notices.
- **Admin:** Has elevated privileges to approve/reject resources, manage users, create/delete notices (including image uploads), view analytics, and manage metadata.

**2.2 Operating Environment**
- Frontend: Cross-platform mobile architecture (e.g., React Native) for iOS and Android.
- Backend: NodeJS with Express, MongoDB database.
- Storage: Cloudflare R2 (S3-compatible) for hosting uploaded resources and notice images.

### 3. System Features
**3.1 Authentication & User Management**
- **Feature:** Users can register and login using email/password. Token-based authentication (JWT) must be stored securely on the device.
- **Admin Actions:** Admins can view users, toggle user statuses (ban/unban), and update roles.

**3.2 Notice Board (Notifications)**
- **Feature:** Students can view a feed of active campus notices/events. High engagement metrics such as view counts are tracked.
- **Admin Actions:** Admins can post new notices. The API now supports uploading an `image` along with notice details (`title`, `content`, `category`, `targetBranch`, `targetYear`, `expiresAt`). Admins can force-delete or vote-to-delete notices.

**3.3 Resource Management**
- **Feature:** Students can view, download, and filter approved academic resources.
- **Upload:** Students can upload files (PDFs, docs) with metadata (title, subject, semester, type).
- **Moderation:** Uploaded resources go into a "pending" queue. Admins review pending resources and can approve or reject them.

**3.4 Moderation & Reporting**
- **Feature:** Students can flag/report resources they deem inappropriate or irrelevant.
- **Admin Actions:** Admins have a dashboard to view reported items and take action (resolve reports or dismiss them).

**3.5 Metadata Configuration**
- **Admin Actions:** Admins can configure predefined metadata values (branches, subjects, exam types, document types) from the mobile dashboard. This drives the application's filtering and dropdown capabilities.

### 4. Data Models Overview
Current core collections interacting with the mobile app:
- **User:** `name`, `email`, `password`, `role`, `status`.
- **Resource:** `title`, `type`, `subjectId`, `branch`, `semester`, `year`, `examType`, `fileUrl`, `status` (pending/approved/rejected), `uploadedBy`.
- **Notification:** `title`, `content`, `category`, `imageUrl` (New feature API v4), `expiresAt`, `isActive`, `views`.
- **Metadata:** `type`, `value`, `priority`, `isActive`.
- **Report & AuditLog:** For administrative tracking and community moderation.

### 5. Non-Functional Requirements
- **Performance:** App must cache notices to prevent excessive API calls. Images fetched from R2 must utilize optimized mobile image components.
- **Security:** Use encrypted storage for JWT tokens. App must handle expired tokens gracefully by forcing re-authentication.
- **Usability:** Implement familiar pull-to-refresh on notices and resource lists.

### 6. API Integration
The mobile application will integrate with "API Version 4", which includes image uploads (`multipart/form-data`) on the Notice Board. See `Campus AI Assistant API version 4.postman_collection.json` for detailed request configurations.

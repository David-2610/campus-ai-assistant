# Requirements Document

## Introduction

The Campus AI Assistant Frontend is a React-based web application that provides students and administrators with a comprehensive platform for managing and accessing educational resources. The system enables students to browse, search, and download approved academic materials while allowing administrators to moderate uploaded content through an approval workflow. The application integrates with an existing backend API and implements role-based access control to ensure proper authorization for different user types.

## Glossary

- **Frontend_Application**: The React-based web application built with Vite, Tailwind CSS, and React Router
- **Auth_System**: The authentication and authorization system using JWT tokens stored in localStorage
- **API_Client**: The configured Axios instance that communicates with the backend API
- **Protected_Route**: A route component that requires user authentication to access
- **Admin_Route**: A route component that requires admin role to access
- **Resource**: An educational material (notes, PYQ, syllabus, etc.) uploaded by users
- **User**: A registered student or administrator who can authenticate and use the system
- **Admin**: A user with elevated privileges who can approve, reject, and manage resources
- **Token**: A JWT authentication token used for API authorization
- **Upload_Form**: The form interface for submitting new educational resources
- **Resource_Card**: A UI component displaying resource information with download capability
- **Navbar**: The navigation bar component showing role-based menu items
- **Auth_Context**: React Context providing authentication state across the application
- **Router**: React Router DOM configuration managing application navigation
- **Filter_System**: UI controls for filtering resources by type, subject, branch, semester, year, and exam type
- **Pagination_System**: UI controls for navigating through paginated resource lists
- **Approval_Workflow**: The admin process of reviewing, approving, or rejecting pending resources

## Requirements

### Requirement 1: Project Initialization and Configuration

**User Story:** As a developer, I want the project properly configured with all required dependencies, so that the application can be built and run successfully.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use React 19.2.4 with Vite 8.0.1 as the build tool
2. THE Frontend_Application SHALL use Tailwind CSS 4.2.2 for styling
3. THE Frontend_Application SHALL use React Router DOM 7.13.1 for routing
4. THE Frontend_Application SHALL use Axios 1.13.6 for HTTP requests
5. THE Frontend_Application SHALL configure absolute imports using @ alias pointing to /src directory
6. THE Frontend_Application SHALL maintain the existing Backend folder structure unchanged

### Requirement 2: Authentication System

**User Story:** As a user, I want to securely authenticate with the system, so that I can access protected features and resources.

#### Acceptance Criteria

1. THE Auth_System SHALL store JWT tokens in localStorage
2. THE Auth_System SHALL store user information in localStorage as JSON
3. THE Auth_System SHALL provide setToken, getToken, and removeToken functions
4. THE Auth_System SHALL provide setUser, getUser, and removeUser functions
5. THE Auth_System SHALL provide an isAdmin function that returns true when user role is "admin"
6. WHEN a user logs in successfully, THE Auth_System SHALL store both token and user data
7. WHEN a user logs out, THE Auth_System SHALL remove both token and user data from localStorage

### Requirement 3: API Client Configuration

**User Story:** As a developer, I want a configured HTTP client, so that all API requests are properly authenticated and routed.

#### Acceptance Criteria

1. THE API_Client SHALL use baseURL from environment variable VITE_API_BASE_URL
2. THE API_Client SHALL implement a request interceptor
3. WHEN an API request is made, THE API_Client SHALL automatically attach the Authorization header with Bearer token format
4. WHEN no token exists in localStorage, THE API_Client SHALL send requests without Authorization header

### Requirement 4: Authentication Context

**User Story:** As a developer, I want centralized authentication state management, so that user authentication status is consistent across all components.

#### Acceptance Criteria

1. THE Auth_Context SHALL provide user state to all child components
2. THE Auth_Context SHALL provide isAuthenticated boolean state
3. THE Auth_Context SHALL provide login function that stores token and user data
4. THE Auth_Context SHALL provide logout function that removes token and user data
5. THE Auth_Context SHALL initialize user state from localStorage on mount
6. WHEN login is called with valid credentials, THE Auth_Context SHALL update user state and persist to localStorage
7. WHEN logout is called, THE Auth_Context SHALL clear user state and remove localStorage data

### Requirement 5: Routing System

**User Story:** As a user, I want proper navigation between different pages, so that I can access various features of the application.

#### Acceptance Criteria

1. THE Router SHALL define public routes: /login and /register
2. THE Router SHALL define protected routes: /, /resources, and /upload
3. THE Router SHALL define admin routes: /admin/dashboard and /admin/resources
4. THE Protected_Route SHALL redirect unauthenticated users to /login
5. THE Admin_Route SHALL redirect non-admin users to home page
6. THE Router SHALL use Outlet pattern for nested route rendering
7. WHEN an unauthenticated user accesses a protected route, THE Router SHALL redirect to /login
8. WHEN a non-admin user accesses an admin route, THE Router SHALL redirect to /

### Requirement 6: User Registration

**User Story:** As a new user, I want to register an account, so that I can access the campus resource system.

#### Acceptance Criteria

1. THE Registration_Page SHALL provide input fields for name, email, password, branch, and semester
2. WHEN the registration form is submitted, THE Frontend_Application SHALL POST to /auth/register with user data
3. WHEN registration succeeds, THE Frontend_Application SHALL redirect user to /login
4. WHEN registration fails, THE Frontend_Application SHALL display the error message
5. THE Registration_Page SHALL validate that all required fields are filled before submission

### Requirement 7: User Login

**User Story:** As a registered user, I want to log in to my account, so that I can access protected features.

#### Acceptance Criteria

1. THE Login_Page SHALL provide input fields for email and password
2. WHEN the login form is submitted, THE Frontend_Application SHALL POST to /auth/login with credentials
3. WHEN login succeeds, THE Auth_System SHALL store the token and user data
4. WHEN login succeeds, THE Frontend_Application SHALL redirect to home page
5. WHEN login fails, THE Frontend_Application SHALL display the error message
6. THE Login_Page SHALL validate that email and password are provided before submission

### Requirement 8: Navigation Bar

**User Story:** As a user, I want a navigation bar with appropriate menu items, so that I can easily navigate the application.

#### Acceptance Criteria

1. THE Navbar SHALL display the application name or logo
2. WHEN user is authenticated, THE Navbar SHALL display links to Home, Resources, and Upload
3. WHEN user is an admin, THE Navbar SHALL additionally display Admin Dashboard and Manage Resources links
4. WHEN user is authenticated, THE Navbar SHALL display user name and logout button
5. WHEN user is not authenticated, THE Navbar SHALL display Login and Register links
6. WHEN logout button is clicked, THE Navbar SHALL call logout function and redirect to /login
7. THE Navbar SHALL be responsive and work on mobile devices

### Requirement 9: Home Page

**User Story:** As a user, I want a welcoming home page, so that I understand the purpose of the application and can navigate to key features.

#### Acceptance Criteria

1. THE Home_Page SHALL display a welcome message
2. THE Home_Page SHALL provide navigation buttons or links to Resources and Upload pages
3. THE Home_Page SHALL use modern, minimal, dashboard-style design
4. THE Home_Page SHALL be responsive across different screen sizes

### Requirement 10: Public Resource Browsing

**User Story:** As a user, I want to browse and search approved resources, so that I can find relevant educational materials.

#### Acceptance Criteria

1. WHEN the Resources page loads, THE Frontend_Application SHALL GET /resources with query parameters
2. THE Resources_Page SHALL display resource cards showing title, type, subject, branch, semester, year, and examType
3. THE Resources_Page SHALL provide filter controls for type, subject, branch, semester, year, and examType
4. THE Resources_Page SHALL provide a search input for searching by title or subject
5. THE Resources_Page SHALL provide pagination controls
6. WHEN a filter is changed, THE Frontend_Application SHALL fetch resources with updated query parameters
7. WHEN search input changes, THE Frontend_Application SHALL fetch resources with search query parameter
8. WHEN pagination controls are used, THE Frontend_Application SHALL fetch resources with updated page parameter
9. THE Resource_Card SHALL display a download link using the fileUrl from the resource
10. THE Resources_Page SHALL display total count and current page information
11. THE Resources_Page SHALL provide sort options for latest and oldest

### Requirement 11: Resource Upload

**User Story:** As an authenticated user, I want to upload educational resources, so that I can contribute materials for other students.

#### Acceptance Criteria

1. THE Upload_Form SHALL provide input fields for title, type, subject, branch, semester, year, and examType
2. THE Upload_Form SHALL provide a file input for selecting the resource file
3. WHEN the upload form is submitted, THE Frontend_Application SHALL POST to /resources/upload with multipart/form-data
4. THE Upload_Form SHALL include the file in the "file" field of the form data
5. WHEN upload succeeds, THE Frontend_Application SHALL display success message indicating pending approval
6. WHEN upload fails, THE Frontend_Application SHALL display the error message
7. THE Upload_Form SHALL validate that all required fields and file are provided before submission
8. THE Upload_Form SHALL be accessible only to authenticated users

### Requirement 12: Admin Dashboard

**User Story:** As an admin, I want to view dashboard statistics, so that I can monitor system usage.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display basic statistics about resources
2. THE Admin_Dashboard SHALL be accessible only to users with admin role
3. THE Admin_Dashboard SHALL use modern, minimal, dashboard-style design
4. THE Admin_Dashboard SHALL provide navigation to resource management features

### Requirement 13: Admin Resource Management

**User Story:** As an admin, I want to manage all resources including pending, approved, and rejected items, so that I can moderate content quality.

#### Acceptance Criteria

1. WHEN the Admin Resource Management page loads, THE Frontend_Application SHALL GET /admin/resources/pending
2. THE Admin_Resource_Page SHALL display pending resources in a list or table format
3. THE Admin_Resource_Page SHALL provide Approve and Reject buttons for each pending resource
4. WHEN Approve button is clicked, THE Frontend_Application SHALL PATCH /admin/resources/:id/approve
5. WHEN Reject button is clicked, THE Frontend_Application SHALL PATCH /admin/resources/:id/reject
6. WHEN approval or rejection succeeds, THE Admin_Resource_Page SHALL refresh the pending resources list
7. THE Admin_Resource_Page SHALL provide tabs for viewing Approved and Rejected resources
8. WHEN Approved tab is selected, THE Frontend_Application SHALL GET /admin/resources/approved
9. WHEN Rejected tab is selected, THE Frontend_Application SHALL GET /admin/resources/rejected
10. THE Admin_Resource_Page SHALL provide Delete button for each resource
11. WHEN Delete button is clicked, THE Frontend_Application SHALL DELETE /admin/resources/:id
12. WHEN deletion succeeds, THE Admin_Resource_Page SHALL refresh the current resource list
13. THE Admin_Resource_Page SHALL be accessible only to users with admin role

### Requirement 14: UI Component Architecture

**User Story:** As a developer, I want reusable UI components, so that the codebase is maintainable and consistent.

#### Acceptance Criteria

1. THE Frontend_Application SHALL organize components into ui and layout subdirectories
2. THE Frontend_Application SHALL use functional components exclusively
3. THE Frontend_Application SHALL use Tailwind CSS classes for all styling
4. THE Frontend_Application SHALL not use inline styles
5. THE Frontend_Application SHALL create reusable components for common UI patterns
6. THE Frontend_Application SHALL maintain modular component structure

### Requirement 15: Layout System

**User Story:** As a user, I want consistent page layouts, so that the application feels cohesive and professional.

#### Acceptance Criteria

1. THE MainLayout SHALL include the Navbar component
2. THE MainLayout SHALL render child routes using Outlet
3. THE MainLayout SHALL apply consistent spacing and styling across all pages
4. THE MainLayout SHALL be responsive and work on mobile devices

### Requirement 16: Error Handling

**User Story:** As a user, I want clear error messages when operations fail, so that I understand what went wrong.

#### Acceptance Criteria

1. WHEN an API request fails, THE Frontend_Application SHALL display the error message from the response
2. WHEN network error occurs, THE Frontend_Application SHALL display a user-friendly error message
3. WHEN form validation fails, THE Frontend_Application SHALL display validation error messages
4. THE Frontend_Application SHALL handle 401 unauthorized errors by redirecting to login

### Requirement 17: Responsive Design

**User Story:** As a user, I want the application to work on different devices, so that I can access it from mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Frontend_Application SHALL use responsive Tailwind CSS classes
2. THE Frontend_Application SHALL be usable on mobile devices (320px width and above)
3. THE Frontend_Application SHALL be usable on tablet devices (768px width and above)
4. THE Frontend_Application SHALL be usable on desktop devices (1024px width and above)
5. THE Navbar SHALL adapt to mobile screen sizes with appropriate menu behavior

### Requirement 18: Production Quality Standards

**User Story:** As a developer, I want production-ready code, so that the application can be deployed without issues.

#### Acceptance Criteria

1. THE Frontend_Application SHALL contain no placeholder logic or TODO comments
2. THE Frontend_Application SHALL properly integrate with all backend API endpoints
3. THE Frontend_Application SHALL handle loading states during API requests
4. THE Frontend_Application SHALL follow React best practices and conventions
5. THE Frontend_Application SHALL use proper error boundaries where appropriate
6. THE Frontend_Application SHALL implement proper form validation
7. THE Frontend_Application SHALL follow clean code architecture principles

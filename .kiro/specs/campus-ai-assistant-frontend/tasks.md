# Implementation Plan: Campus AI Assistant Frontend

## Overview

This implementation plan breaks down the Campus AI Assistant Frontend into discrete, actionable coding tasks. The application is a React-based SPA using Vite, Tailwind CSS v4, React Router DOM, and Axios. The implementation follows a bottom-up approach: starting with utilities and configuration, then building reusable components, followed by page components, and finally integration and testing.

Each task builds incrementally on previous work, ensuring no orphaned code. Testing tasks are marked as optional with "*" to allow for faster MVP delivery while maintaining the option for comprehensive test coverage.

## Tasks

- [x] 1. Project setup and configuration
  - [x] 1.1 Install and configure dependencies
    - Install React 19.2.4, Vite 8.0.1, Tailwind CSS 4.2.2, React Router DOM 7.13.1, Axios 1.13.6
    - Configure Vite with @ alias pointing to /src directory in vite.config.js
    - Configure Tailwind CSS in tailwind.config.js
    - Update index.css with Tailwind directives
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Authentication utilities and constants
  - [x] 2.1 Create authentication utility functions
    - Implement setToken, getToken, removeToken functions for localStorage
    - Implement setUser, getUser, removeUser functions for localStorage
    - Implement isAdmin function that checks user role
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 2.2 Write property tests for authentication utilities
    - **Property 1: Authentication Storage Round-Trip**
    - **Property 2: isAdmin Role Detection**
    - **Validates: Requirements 2.1, 2.2, 2.5**
  
  - [x] 2.3 Create application constants
    - Define RESOURCE_TYPES, BRANCHES, SEMESTERS, EXAM_TYPES, YEARS constants
    - Export constants from utils/constants.js
    - _Requirements: 14.6_

- [-] 3. API client configuration
  - [x] 3.1 Create and configure Axios instance
    - Create api.js with Axios instance using baseURL "http://localhost:5000/api"
    - Implement request interceptor to attach Authorization header with Bearer token
    - Implement response interceptor to handle 401 errors and redirect to login
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 16.4_
  
  - [ ]* 3.2 Write property tests for API client
    - **Property 5: API Authorization Header Attachment**
    - **Property 31: Unauthorized Error Handling**
    - **Validates: Requirements 3.3, 16.4**

- [x] 4. Authentication context
  - [x] 4.1 Create AuthContext with provider
    - Create AuthContext with user state and isAuthenticated boolean
    - Implement login function that stores token and user data
    - Implement logout function that removes token and user data
    - Initialize user state from localStorage on mount
    - Export useAuth custom hook for consuming context
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 4.2 Write property tests for AuthContext
    - **Property 3: Login Persistence**
    - **Property 4: Logout Cleanup**
    - **Property 6: Context Initialization from Storage**
    - **Validates: Requirements 2.6, 2.7, 4.5**

- [x] 5. Routing components
  - [x] 5.1 Create ProtectedRoute component
    - Check authentication status using useAuth hook
    - Redirect to /login if not authenticated
    - Render children if authenticated
    - _Requirements: 5.4, 5.7_
  
  - [x] 5.2 Create AdminRoute component
    - Check authentication and admin role using useAuth hook
    - Redirect to / if not authenticated or not admin
    - Render children if admin
    - _Requirements: 5.5, 5.8_
  
  - [ ]* 5.3 Write property tests for routing components
    - **Property 7: Protected Route Redirection**
    - **Property 8: Admin Route Redirection**
    - **Validates: Requirements 5.4, 5.5**

- [x] 6. Reusable UI components
  - [x] 6.1 Create Button component
    - Accept props: children, onClick, type, variant, disabled, className
    - Apply Tailwind CSS classes for styling
    - Support primary, secondary, danger variants
    - _Requirements: 14.1, 14.3, 14.5_
  
  - [x] 6.2 Create Input component
    - Accept props: type, name, value, onChange, placeholder, required, error, label
    - Apply Tailwind CSS classes for styling
    - Display error message if provided
    - _Requirements: 14.1, 14.3, 14.5_
  
  - [x] 6.3 Create LoadingSpinner component
    - Display animated spinner using Tailwind CSS
    - Accept size prop (small, medium, large)
    - _Requirements: 14.1, 14.3, 18.3_
  
  - [x] 6.4 Create ResourceCard component
    - Accept resource prop with all resource fields
    - Display title, type, subject, branch, semester, year, examType
    - Display uploader name and upload date
    - Provide download link using fileUrl
    - Apply responsive grid layout with Tailwind CSS
    - _Requirements: 10.2, 10.9, 14.1, 14.3_
  
  - [ ]* 6.5 Write property tests for ResourceCard
    - **Property 18: Resource Card Display**
    - **Property 22: Download Link Mapping**
    - **Validates: Requirements 10.2, 10.9**
  
  - [x] 6.6 Create FilterBar component
    - Accept filters prop and onFilterChange callback
    - Render select dropdowns for type, subject, branch, semester, year, examType
    - Render search input
    - Provide reset button to clear all filters
    - Apply Tailwind CSS styling
    - _Requirements: 10.3, 10.4, 14.1, 14.3_
  
  - [x] 6.7 Create Pagination component
    - Accept currentPage, totalPages, onPageChange props
    - Display current page and total pages
    - Provide Previous/Next buttons
    - Disable buttons at boundaries
    - Apply Tailwind CSS styling
    - _Requirements: 10.5, 14.1, 14.3_
  
  - [ ]* 6.8 Write unit tests for UI components
    - Test Button variants and disabled state
    - Test Input error display and validation
    - Test LoadingSpinner rendering
    - Test Pagination boundary conditions
    - _Requirements: 14.5_

- [x] 7. Layout components
  - [x] 7.1 Create Navbar component
    - Use useAuth hook to get user and authentication status
    - Display app logo/name
    - Show Login and Register links when not authenticated
    - Show Home, Resources, Upload links when authenticated
    - Show Admin Dashboard and Manage Resources links when user is admin
    - Display user name and logout button when authenticated
    - Implement logout functionality that calls logout from context
    - Apply responsive Tailwind CSS styling with mobile menu
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 15.4_
  
  - [ ]* 7.2 Write property tests for Navbar
    - **Property 13: Authenticated User Navigation**
    - **Property 14: Admin User Navigation**
    - **Property 15: Authenticated User Display**
    - **Property 16: Unauthenticated User Navigation**
    - **Property 17: Logout Interaction**
    - **Validates: Requirements 8.2, 8.3, 8.4, 8.5, 8.6**
  
  - [x] 7.3 Create MainLayout component
    - Include Navbar component
    - Render child routes using Outlet from React Router
    - Apply consistent spacing and styling with Tailwind CSS
    - Ensure responsive design
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [-] 8. Authentication pages
  - [x] 8.1 Create Login page
    - Create form with email and password inputs using Input component
    - Implement form validation before submission
    - Handle form submission with POST to /auth/login
    - On success: call login from AuthContext and redirect to /
    - On error: display error message
    - Show loading spinner during API request
    - Apply Tailwind CSS styling
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 16.1, 16.3, 18.3_
  
  - [ ]* 8.2 Write property tests for Login page
    - **Property 10: Login Form Submission**
    - **Property 12: Form Validation**
    - **Property 32: Loading State During API Requests**
    - **Validates: Requirements 7.2, 7.6, 18.3**
  
  - [x] 8.3 Create Register page
    - Create form with name, email, password, branch, semester inputs using Input component
    - Use constants for branch and semester dropdowns
    - Implement form validation before submission
    - Handle form submission with POST to /auth/register
    - On success: redirect to /login with success message
    - On error: display error message
    - Show loading spinner during API request
    - Apply Tailwind CSS styling
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 16.1, 16.3, 18.3_
  
  - [ ]* 8.4 Write property tests for Register page
    - **Property 9: Registration Form Submission**
    - **Property 11: API Error Display**
    - **Property 12: Form Validation**
    - **Validates: Requirements 6.2, 6.4, 6.5**

- [x] 9. Checkpoint - Ensure authentication flow works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Home page
  - [x] 10.1 Create Home page component
    - Display welcome message and app description
    - Show quick action buttons to Resources and Upload pages using Button component
    - Apply modern dashboard-style layout with Tailwind CSS
    - Ensure responsive design
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 11. Resources browsing page
  - [x] 11.1 Create Resources page component
    - Initialize state for resources, filters, pagination, sort, loading, error
    - Fetch resources on mount with GET /resources
    - Implement filter change handler that updates filters and re-fetches
    - Implement search handler that updates search query and re-fetches
    - Implement pagination handler that updates page and re-fetches
    - Implement sort handler that updates sort and re-fetches
    - Display resources in grid layout using ResourceCard component
    - Display FilterBar component with filters and handlers
    - Display Pagination component with pagination state and handler
    - Show LoadingSpinner during fetch
    - Display error message on failure
    - Show "No resources found" when empty
    - Display total count and current page information
    - Apply responsive Tailwind CSS styling
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 16.1, 16.2, 18.3_
  
  - [ ]* 11.2 Write property tests for Resources page
    - **Property 19: Filter Change Triggers Fetch**
    - **Property 20: Search Query Triggers Fetch**
    - **Property 21: Pagination Triggers Fetch**
    - **Property 23: Pagination Metadata Display**
    - **Validates: Requirements 10.6, 10.7, 10.8, 10.10**

- [x] 12. Resource upload page
  - [x] 12.1 Create Upload page component
    - Create form with inputs for title, type, subject, branch, semester, year, examType using Input component
    - Use constants for dropdowns
    - Add file input for resource file
    - Implement form validation before submission
    - Handle form submission with POST to /resources/upload using multipart/form-data
    - Include file in "file" field of form data
    - On success: display success message and reset form
    - On error: display error message
    - Show loading spinner during upload
    - Apply Tailwind CSS styling
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 16.1, 16.3, 18.3_
  
  - [ ]* 12.2 Write property tests for Upload page
    - **Property 24: Upload Form Submission**
    - **Property 12: Form Validation**
    - **Validates: Requirements 11.3, 11.4, 11.7**

- [x] 13. Checkpoint - Ensure student features work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Admin dashboard page
  - [x] 14.1 Create Admin Dashboard page component
    - Fetch and display basic statistics about resources
    - Display stats in card layout using Tailwind CSS
    - Provide navigation buttons to resource management using Button component
    - Apply modern dashboard design
    - Show loading spinner during fetch
    - Display error message on failure
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 18.3_

- [x] 15. Admin resource management page
  - [x] 15.1 Create Admin Manage Resources page component
    - Initialize state for activeTab, resources, loading, error
    - Implement tab navigation for pending/approved/rejected
    - Fetch pending resources on mount with GET /admin/resources/pending
    - Fetch resources based on activeTab when tab changes
    - Display resources in table format with all resource fields
    - Provide Approve button for pending resources that calls PATCH /admin/resources/:id/approve
    - Provide Reject button for pending resources that calls PATCH /admin/resources/:id/reject
    - Provide Delete button for all resources that calls DELETE /admin/resources/:id
    - Implement confirmation dialog for destructive actions
    - Refresh resource list after successful actions
    - Show loading spinner during operations
    - Display error message on failure
    - Apply Tailwind CSS styling
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10, 13.11, 13.12, 13.13, 16.1, 18.3_
  
  - [ ]* 15.2 Write property tests for Admin Manage Resources page
    - **Property 25: Admin Action Buttons**
    - **Property 26: Approve Action Triggers API Call**
    - **Property 27: Reject Action Triggers API Call**
    - **Property 28: Admin Action Refresh**
    - **Property 29: Delete Action Triggers API Call**
    - **Validates: Requirements 13.3, 13.4, 13.5, 13.6, 13.10, 13.11, 13.12**

- [x] 16. Router configuration and app integration
  - [x] 16.1 Create AppRoutes component
    - Define public routes: /login and /register
    - Define protected routes: /, /resources, /upload using ProtectedRoute
    - Define admin routes: /admin/dashboard, /admin/resources using AdminRoute
    - Use MainLayout for all routes
    - Configure React Router with BrowserRouter
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 16.2 Update App.jsx to use AuthProvider and AppRoutes
    - Wrap application with AuthProvider
    - Render AppRoutes component
    - _Requirements: 4.1, 5.6_
  
  - [x] 16.3 Update main.jsx entry point
    - Ensure React 19.2.4 is properly imported and used
    - Render App component
    - _Requirements: 1.1_

- [x] 17. Checkpoint - Ensure all features work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 18. Property-based tests for form validation
  - [ ]* 18.1 Write property tests for validation error display
    - **Property 30: Validation Error Display**
    - **Validates: Requirements 16.3**

- [ ]* 19. Integration tests
  - [ ]* 19.1 Write integration test for user registration flow
    - Test registration → login → browse resources → upload resource
    - _Requirements: 6.1-6.5, 7.1-7.6, 10.1-10.11, 11.1-11.8_
  
  - [ ]* 19.2 Write integration test for admin workflow
    - Test admin login → view pending resources → approve/reject → verify changes
    - _Requirements: 7.1-7.6, 13.1-13.13_
  
  - [ ]* 19.3 Write integration test for protected route flow
    - Test unauthenticated user → attempt protected route → redirect to login → login → access route
    - _Requirements: 5.4, 5.7, 7.1-7.6_

- [ ]* 20. End-to-end tests
  - [ ]* 20.1 Set up Playwright or Cypress for E2E testing
    - Install and configure E2E testing framework
    - _Requirements: 18.1-18.7_
  
  - [ ]* 20.2 Write E2E test for complete user journey
    - Test full user flow from registration to resource upload
    - _Requirements: 6.1-6.5, 7.1-7.6, 10.1-10.11, 11.1-11.8_
  
  - [ ]* 20.3 Write E2E test for admin approval workflow
    - Test admin reviewing and approving resources
    - _Requirements: 13.1-13.13_

- [ ] 21. Final checkpoint and production readiness
  - Verify no placeholder logic or TODO comments exist
  - Ensure all backend API endpoints are properly integrated
  - Verify loading states are implemented for all API requests
  - Confirm error boundaries are in place
  - Validate responsive design on mobile, tablet, and desktop
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 17.1-17.5, 18.1-18.7_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration and E2E tests validate complete user workflows
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows a bottom-up approach: utilities → components → pages → integration
- All styling uses Tailwind CSS classes, no inline styles
- All components are functional components using React hooks
- The existing Backend folder structure remains unchanged

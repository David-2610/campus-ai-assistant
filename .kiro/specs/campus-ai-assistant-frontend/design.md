# Design Document: Campus AI Assistant Frontend

## Overview

The Campus AI Assistant Frontend is a React-based single-page application (SPA) that provides a modern, minimal dashboard-style interface for managing educational resources. The application follows a component-based architecture using React 19.2.4, with Vite as the build tool, Tailwind CSS for styling, and React Router DOM for client-side routing.

The system implements role-based access control (RBAC) with two user types: students and administrators. Students can browse approved resources, search and filter content, and upload new materials for approval. Administrators have additional privileges to review pending uploads, approve or reject submissions, and manage all resources in the system.

The frontend communicates with a RESTful backend API using Axios, with JWT-based authentication stored in localStorage. The application uses React Context for global authentication state management and implements protected routing to ensure proper authorization.

### Key Design Principles

- **Separation of Concerns**: Clear separation between UI components, business logic, API communication, and authentication
- **Component Reusability**: Modular components that can be composed and reused across different pages
- **Responsive Design**: Mobile-first approach using Tailwind CSS responsive utilities
- **Type Safety**: Consistent data structures and prop validation
- **User Experience**: Loading states, error handling, and clear feedback for all user actions

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Application                      │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│  │  │   Router     │  │ Auth Context │  │   Pages  │ │    │
│  │  │ (React       │  │ (Global      │  │          │ │    │
│  │  │  Router)     │  │  State)      │  │          │ │    │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘ │    │
│  │         │                 │                │        │    │
│  │         └─────────────────┴────────────────┘        │    │
│  │                          │                          │    │
│  │                  ┌───────▼────────┐                 │    │
│  │                  │   Components   │                 │    │
│  │                  │  (UI + Layout) │                 │    │
│  │                  └───────┬────────┘                 │    │
│  │                          │                          │    │
│  │                  ┌───────▼────────┐                 │    │
│  │                  │   API Client   │                 │    │
│  │                  │    (Axios)     │                 │    │
│  │                  └───────┬────────┘                 │    │
│  └────────────────────────┬─┬────────────────────────┘    │
│                            │ │                             │
│  ┌─────────────────────────┘ └──────────────────────┐     │
│  │ localStorage                                      │     │
│  │ - JWT Token                                       │     │
│  │ - User Data                                       │     │
│  └───────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │ (REST API)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend API Server                        │
│              (VITE_API_BASE_URL from .env)                   │
│                                                              │
│  Endpoints:                                                  │
│  - POST   /auth/register                                     │
│  - POST   /auth/login                                        │
│  - GET    /resources (public, filtered, paginated)          │
│  - POST   /resources/upload (authenticated)                  │
│  - GET    /admin/resources/pending (admin)                   │
│  - GET    /admin/resources/approved (admin)                  │
│  - GET    /admin/resources/rejected (admin)                  │
│  - PATCH  /admin/resources/:id/approve (admin)               │
│  - PATCH  /admin/resources/:id/reject (admin)                │
│  - DELETE /admin/resources/:id (admin)                       │
└──────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **Initial Load**: Application checks localStorage for existing token and user data
2. **Authentication**: User logs in → token stored → AuthContext updated → redirect to home
3. **Protected Routes**: Router checks authentication status before rendering protected pages
4. **API Requests**: Axios interceptor automatically attaches JWT token to all requests
5. **Data Fetching**: Components fetch data on mount and update based on user interactions
6. **State Management**: Local component state for UI, Context for global auth state

### Directory Structure

```
Frontend/
├── src/
│   ├── api/
│   │   └── api.js                    # Axios instance with interceptors
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Navigation bar with role-based menu
│   │   │   └── Footer.jsx            # Optional footer component
│   │   └── ui/
│   │       ├── ResourceCard.jsx      # Display resource information
│   │       ├── FilterBar.jsx         # Filter controls for resources
│   │       ├── Pagination.jsx        # Pagination controls
│   │       ├── Button.jsx            # Reusable button component
│   │       ├── Input.jsx             # Reusable input component
│   │       └── LoadingSpinner.jsx    # Loading indicator
│   ├── context/
│   │   └── AuthContext.jsx           # Authentication context provider
│   ├── layouts/
│   │   └── MainLayout.jsx            # Main layout with Navbar + Outlet
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Register.jsx          # Registration page
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx         # Admin dashboard with stats
│   │   │   └── ManageResources.jsx   # Admin resource management
│   │   ├── Home.jsx                  # Landing page
│   │   ├── Resources.jsx             # Public resource browsing
│   │   └── Upload.jsx                # Resource upload form
│   ├── routes/
│   │   ├── AppRoutes.jsx             # Main router configuration
│   │   ├── ProtectedRoute.jsx        # Authentication guard
│   │   └── AdminRoute.jsx            # Admin role guard
│   ├── utils/
│   │   ├── auth.js                   # Auth helper functions
│   │   └── constants.js              # App constants (types, branches, etc.)
│   ├── App.jsx                       # Root component
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── index.html
├── vite.config.js
├── package.json
└── tailwind.config.js
```

## Components and Interfaces

### Core Components

#### 1. AuthContext

**Purpose**: Provides global authentication state and methods to all components.

**State**:
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    role: "student" | "admin",
    branch: string,
    semester: number
  } | null,
  isAuthenticated: boolean
}
```

**Methods**:
- `login(token, user)`: Stores authentication data and updates state
- `logout()`: Clears authentication data and redirects to login
- `checkAuth()`: Validates token and initializes user state from localStorage

**Usage**:
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

#### 2. Navbar Component

**Props**: None (uses AuthContext)

**Behavior**:
- Displays app logo/name
- Shows role-based navigation links
- Displays user name and logout button when authenticated
- Responsive mobile menu

**Navigation Items**:
- Public: Login, Register
- Authenticated: Home, Resources, Upload, Logout
- Admin: + Admin Dashboard, Manage Resources

#### 3. ResourceCard Component

**Props**:
```javascript
{
  resource: {
    _id: string,
    title: string,
    type: string,
    subject: string,
    branch: string,
    semester: number,
    year: number,
    examType: string,
    fileUrl: string,
    uploadedBy: { name: string },
    createdAt: string
  }
}
```

**Behavior**:
- Displays resource metadata in a card layout
- Provides download link to fileUrl
- Shows upload date and uploader name
- Responsive grid layout

#### 4. FilterBar Component

**Props**:
```javascript
{
  filters: {
    type: string,
    subject: string,
    branch: string,
    semester: number,
    year: number,
    examType: string,
    search: string
  },
  onFilterChange: (filterName: string, value: any) => void,
  onReset: () => void
}
```

**Behavior**:
- Renders select dropdowns for each filter
- Renders search input
- Calls onFilterChange when any filter changes
- Provides reset button to clear all filters

#### 5. Pagination Component

**Props**:
```javascript
{
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
}
```

**Behavior**:
- Displays current page and total pages
- Provides Previous/Next buttons
- Disables buttons at boundaries
- Shows page numbers with ellipsis for large page counts

#### 6. ProtectedRoute Component

**Props**:
```javascript
{
  children: ReactNode
}
```

**Behavior**:
- Checks if user is authenticated via AuthContext
- Renders children if authenticated
- Redirects to /login if not authenticated

#### 7. AdminRoute Component

**Props**:
```javascript
{
  children: ReactNode
}
```

**Behavior**:
- Checks if user is authenticated AND has admin role
- Renders children if admin
- Redirects to / if not admin or not authenticated

### Page Components

#### 1. Login Page

**State**:
```javascript
{
  email: string,
  password: string,
  error: string | null,
  loading: boolean
}
```

**Behavior**:
- Form validation before submission
- POST to /auth/login
- On success: store token/user, redirect to /
- On error: display error message

#### 2. Register Page

**State**:
```javascript
{
  name: string,
  email: string,
  password: string,
  branch: string,
  semester: number,
  error: string | null,
  loading: boolean
}
```

**Behavior**:
- Form validation before submission
- POST to /auth/register
- On success: redirect to /login with success message
- On error: display error message

#### 3. Home Page

**Behavior**:
- Displays welcome message and app description
- Shows quick action buttons (Browse Resources, Upload Resource)
- Displays recent statistics or featured resources
- Modern dashboard-style layout

#### 4. Resources Page

**State**:
```javascript
{
  resources: Array<Resource>,
  filters: {
    type: string,
    subject: string,
    branch: string,
    semester: number,
    year: number,
    examType: string,
    search: string
  },
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  },
  sort: "latest" | "oldest",
  loading: boolean,
  error: string | null
}
```

**Behavior**:
- Fetches resources on mount with default filters
- Re-fetches when filters, search, pagination, or sort changes
- Displays resources in grid layout using ResourceCard
- Shows loading spinner during fetch
- Displays error message on failure
- Shows "No resources found" when empty

**API Call**:
```javascript
GET /resources?type=notes&subject=math&page=1&limit=10&sort=latest
```

#### 5. Upload Page

**State**:
```javascript
{
  form: {
    title: string,
    type: string,
    subject: string,
    branch: string,
    semester: number,
    year: number,
    examType: string,
    file: File | null
  },
  loading: boolean,
  error: string | null
}
```

**Behavior**:
- Form with all required fields
- File input for resource upload
- Validation before submission
- POST to /resources/upload with multipart/form-data
- On success: show success message, reset form
- On error: display error message

#### 6. Admin Dashboard Page

**State**:
```javascript
{
  stats: {
    totalResources: number,
    pendingResources: number,
    approvedResources: number,
    rejectedResources: number,
    totalUsers: number
  },
  loading: boolean,
  error: string | null
}
```

**Behavior**:
- Displays statistics in card layout
- Provides navigation to resource management
- Modern dashboard design with charts/graphs (optional)

#### 7. Admin Manage Resources Page

**State**:
```javascript
{
  activeTab: "pending" | "approved" | "rejected",
  resources: Array<Resource>,
  loading: boolean,
  error: string | null
}
```

**Behavior**:
- Tab navigation for pending/approved/rejected resources
- Fetches resources based on active tab
- Displays resources in table format
- Provides action buttons (Approve, Reject, Delete)
- Confirms destructive actions
- Refreshes list after actions

**API Calls**:
```javascript
GET /admin/resources/pending
GET /admin/resources/approved
GET /admin/resources/rejected
PATCH /admin/resources/:id/approve
PATCH /admin/resources/:id/reject
DELETE /admin/resources/:id
```

## Data Models

### Frontend Data Structures

#### User Model
```javascript
{
  _id: string,
  name: string,
  email: string,
  role: "student" | "admin",
  branch: string,
  semester: number,
  createdAt: string,
  updatedAt: string
}
```

#### Resource Model
```javascript
{
  _id: string,
  title: string,
  type: string,              // "notes", "pyq", "syllabus", "book", "other"
  subject: string,
  branch: string,            // "CSE", "ECE", "ME", "CE", "EE", etc.
  semester: number,          // 1-8
  year: number,              // 2020-2025
  examType: string,          // "mid1", "mid2", "end", "quiz", "assignment"
  fileUrl: string,           // Cloudflare R2 URL
  uploadedBy: {
    _id: string,
    name: string
  },
  status: "pending" | "approved" | "rejected",
  createdAt: string,
  updatedAt: string
}
```

#### API Response Models

**Login/Register Response**:
```javascript
{
  message: string,
  token: string,
  user: User
}
```

**Resources List Response**:
```javascript
{
  total: number,
  page: number,
  totalPages: number,
  data: Array<Resource>
}
```

**Single Resource Response**:
```javascript
{
  message: string,
  resource: Resource
}
```

**Error Response**:
```javascript
{
  message: string,
  error?: string
}
```

### Constants

```javascript
// utils/constants.js

export const RESOURCE_TYPES = [
  { value: "notes", label: "Notes" },
  { value: "pyq", label: "Previous Year Questions" },
  { value: "syllabus", label: "Syllabus" },
  { value: "book", label: "Book" },
  { value: "other", label: "Other" }
];

export const BRANCHES = [
  { value: "CSE", label: "Computer Science" },
  { value: "ECE", label: "Electronics & Communication" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
  { value: "EE", label: "Electrical Engineering" }
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const EXAM_TYPES = [
  { value: "mid1", label: "Mid-1" },
  { value: "mid2", label: "Mid-2" },
  { value: "end", label: "End Semester" },
  { value: "quiz", label: "Quiz" },
  { value: "assignment", label: "Assignment" }
];

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
```

### State Management Strategy

**Local Component State**: Used for UI-specific state (form inputs, loading, errors)

**React Context**: Used for global authentication state (user, isAuthenticated)

**No Redux**: The application complexity doesn't warrant Redux. Context + local state is sufficient.

**Data Fetching**: Components fetch their own data using useEffect. No global data cache.

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Authentication Storage Round-Trip

*For any* valid token and user object, storing them via the auth system and then retrieving them should return equivalent values.

**Validates: Requirements 2.1, 2.2**

### Property 2: isAdmin Role Detection

*For any* user object, the isAdmin function should return true if and only if the user's role is "admin".

**Validates: Requirements 2.5**

### Property 3: Login Persistence

*For any* successful login operation with valid token and user data, both the token and user should be retrievable from localStorage after the login completes.

**Validates: Requirements 2.6**

### Property 4: Logout Cleanup

*For any* authenticated state, calling logout should result in both token and user data being removed from localStorage.

**Validates: Requirements 2.7**

### Property 5: API Authorization Header Attachment

*For any* API request made when a token exists in localStorage, the request should include an Authorization header with the format "Bearer {token}".

**Validates: Requirements 3.3**

### Property 6: Context Initialization from Storage

*For any* valid authentication data stored in localStorage, the AuthContext should initialize with that user data when the application mounts.

**Validates: Requirements 4.5**

### Property 7: Protected Route Redirection

*For any* protected route, when accessed by an unauthenticated user, the application should redirect to /login.

**Validates: Requirements 5.4**

### Property 8: Admin Route Redirection

*For any* admin route, when accessed by a non-admin user (or unauthenticated user), the application should redirect to the home page.

**Validates: Requirements 5.5**

### Property 9: Registration Form Submission

*For any* valid registration form data (name, email, password, branch, semester), submitting the form should trigger a POST request to /auth/register with that data.

**Validates: Requirements 6.2**

### Property 10: Login Form Submission

*For any* valid login credentials (email, password), submitting the login form should trigger a POST request to /auth/login with those credentials.

**Validates: Requirements 7.2**

### Property 11: API Error Display

*For any* API request that fails with an error response, the application should display the error message from the response to the user.

**Validates: Requirements 6.4, 7.5, 11.6, 16.1**

### Property 12: Form Validation

*For any* form with required fields, attempting to submit the form with missing required fields should prevent submission and display validation errors.

**Validates: Requirements 6.5, 7.6, 11.7**

### Property 13: Authenticated User Navigation

*For any* authenticated user, the Navbar should display links to Home, Resources, and Upload pages.

**Validates: Requirements 8.2**

### Property 14: Admin User Navigation

*For any* user with admin role, the Navbar should display Admin Dashboard and Manage Resources links in addition to standard authenticated user links.

**Validates: Requirements 8.3**

### Property 15: Authenticated User Display

*For any* authenticated user, the Navbar should display the user's name and a logout button.

**Validates: Requirements 8.4**

### Property 16: Unauthenticated User Navigation

*For any* unauthenticated user, the Navbar should display Login and Register links.

**Validates: Requirements 8.5**

### Property 17: Logout Interaction

*For any* authenticated user, clicking the logout button should clear authentication data from localStorage and redirect to /login.

**Validates: Requirements 8.6**

### Property 18: Resource Card Display

*For any* resource object, the ResourceCard component should display all required fields: title, type, subject, branch, semester, year, and examType.

**Validates: Requirements 10.2**

### Property 19: Filter Change Triggers Fetch

*For any* filter parameter change (type, subject, branch, semester, year, examType), the application should fetch resources with the updated query parameters.

**Validates: Requirements 10.6**

### Property 20: Search Query Triggers Fetch

*For any* search input change, the application should fetch resources with the search query parameter included in the request.

**Validates: Requirements 10.7**

### Property 21: Pagination Triggers Fetch

*For any* page change via pagination controls, the application should fetch resources with the updated page parameter.

**Validates: Requirements 10.8**

### Property 22: Download Link Mapping

*For any* resource displayed in a ResourceCard, the download link should match the fileUrl property of that resource.

**Validates: Requirements 10.9**

### Property 23: Pagination Metadata Display

*For any* resources list response, the displayed total count and current page information should match the values from the API response.

**Validates: Requirements 10.10**

### Property 24: Upload Form Submission

*For any* valid upload form data (title, type, subject, branch, semester, year, examType, file), submitting the form should trigger a POST request to /resources/upload with multipart/form-data format including the file in the "file" field.

**Validates: Requirements 11.3, 11.4**

### Property 25: Admin Action Buttons

*For any* resource displayed in the admin resource management interface, the interface should provide appropriate action buttons (Approve/Reject for pending, Delete for all).

**Validates: Requirements 13.3, 13.10**

### Property 26: Approve Action Triggers API Call

*For any* pending resource, clicking the Approve button should trigger a PATCH request to /admin/resources/:id/approve with the correct resource ID.

**Validates: Requirements 13.4**

### Property 27: Reject Action Triggers API Call

*For any* pending resource, clicking the Reject button should trigger a PATCH request to /admin/resources/:id/reject with the correct resource ID.

**Validates: Requirements 13.5**

### Property 28: Admin Action Refresh

*For any* successful approve, reject, or delete action, the admin resource page should refresh the current resource list.

**Validates: Requirements 13.6, 13.12**

### Property 29: Delete Action Triggers API Call

*For any* resource in the admin interface, clicking the Delete button should trigger a DELETE request to /admin/resources/:id with the correct resource ID.

**Validates: Requirements 13.11**

### Property 30: Validation Error Display

*For any* form validation failure, the application should display validation error messages to the user.

**Validates: Requirements 16.3**

### Property 31: Unauthorized Error Handling

*For any* API request that returns a 401 unauthorized error, the application should redirect the user to the login page.

**Validates: Requirements 16.4**

### Property 32: Loading State During API Requests

*For any* API request in progress, the application should display a loading indicator until the request completes or fails.

**Validates: Requirements 18.3**

## Error Handling

### Error Categories

**1. Authentication Errors**
- Invalid credentials (401)
- Expired token (401)
- Missing token (401)

**Handling Strategy**:
- Display error message to user
- Redirect to login page for 401 errors
- Clear invalid tokens from localStorage

**2. Authorization Errors**
- Insufficient permissions (403)
- Non-admin accessing admin routes

**Handling Strategy**:
- Redirect to appropriate page (home for non-admin)
- Display "Access Denied" message
- Log unauthorized access attempts

**3. Validation Errors**
- Missing required fields
- Invalid email format
- File size/type restrictions

**Handling Strategy**:
- Prevent form submission
- Display inline validation messages
- Highlight invalid fields

**4. Network Errors**
- Server unreachable
- Timeout
- Connection lost

**Handling Strategy**:
- Display user-friendly error message
- Provide retry option
- Cache form data to prevent loss

**5. API Errors**
- Resource not found (404)
- Server error (500)
- Bad request (400)

**Handling Strategy**:
- Display error message from API response
- Log error details for debugging
- Provide fallback UI or retry option

### Error Handling Implementation

**API Client Configuration**:
```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Component-Level Error Handling**:
```javascript
try {
  const response = await api.post('/endpoint', data);
  // Handle success
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  setError(message);
}
```

**Form Validation**:
```javascript
const validateForm = () => {
  const errors = {};
  if (!form.email) errors.email = 'Email is required';
  if (!form.password) errors.password = 'Password is required';
  return errors;
};
```

### Error Boundaries

Implement React Error Boundaries for catching component errors:

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Dual Testing Approach

The application will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
**Property Tests**: Verify universal properties across all inputs through randomization

### Unit Testing

**Framework**: Vitest with React Testing Library

**Focus Areas**:
1. **Component Rendering**: Verify components render with correct props
2. **User Interactions**: Test button clicks, form submissions, navigation
3. **Edge Cases**: Empty states, error states, loading states
4. **Integration Points**: Component composition, context consumption

**Example Unit Tests**:
```javascript
// Login component
describe('Login', () => {
  it('should display error message on failed login', async () => {
    // Specific example of error handling
  });
  
  it('should disable submit button while loading', () => {
    // Edge case: loading state
  });
});

// ResourceCard component
describe('ResourceCard', () => {
  it('should render with minimal required props', () => {
    // Edge case: minimal data
  });
  
  it('should handle missing optional fields gracefully', () => {
    // Edge case: incomplete data
  });
});
```

**Unit Test Balance**: Avoid writing too many unit tests. Property-based tests handle comprehensive input coverage. Unit tests should focus on specific examples that demonstrate correct behavior and edge cases that are difficult to generate randomly.

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: **Feature: campus-ai-assistant-frontend, Property {number}: {property_text}**

**Property Test Examples**:

```javascript
import fc from 'fast-check';

// Feature: campus-ai-assistant-frontend, Property 1: Authentication Storage Round-Trip
describe('Property 1: Authentication Storage Round-Trip', () => {
  it('should preserve token and user data through storage', () => {
    fc.assert(
      fc.property(
        fc.string(), // token
        fc.record({ // user
          _id: fc.string(),
          name: fc.string(),
          email: fc.emailAddress(),
          role: fc.constantFrom('student', 'admin'),
          branch: fc.string(),
          semester: fc.integer({ min: 1, max: 8 })
        }),
        (token, user) => {
          setToken(token);
          setUser(user);
          
          const retrievedToken = getToken();
          const retrievedUser = getUser();
          
          expect(retrievedToken).toBe(token);
          expect(retrievedUser).toEqual(user);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: campus-ai-assistant-frontend, Property 2: isAdmin Role Detection
describe('Property 2: isAdmin Role Detection', () => {
  it('should return true only for admin users', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.string(),
          name: fc.string(),
          email: fc.emailAddress(),
          role: fc.constantFrom('student', 'admin'),
          branch: fc.string(),
          semester: fc.integer({ min: 1, max: 8 })
        }),
        (user) => {
          setUser(user);
          const result = isAdmin();
          expect(result).toBe(user.role === 'admin');
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: campus-ai-assistant-frontend, Property 11: API Error Display
describe('Property 11: API Error Display', () => {
  it('should display error message from any failed API response', () => {
    fc.assert(
      fc.property(
        fc.string(), // error message
        fc.integer({ min: 400, max: 599 }), // error status
        async (errorMessage, statusCode) => {
          // Mock API to return error
          // Trigger API call
          // Verify error message is displayed
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Coverage**:
- All 32 correctness properties must have corresponding property-based tests
- Each test should generate diverse inputs to cover edge cases
- Tests should verify the property holds across all generated inputs

### Integration Testing

**Focus**: End-to-end user flows

**Key Flows**:
1. User registration → login → browse resources → upload resource
2. Admin login → view pending resources → approve/reject → verify changes
3. Unauthenticated user → attempt protected route → redirect to login → login → access route

**Tools**: Playwright or Cypress for E2E testing

### Test Organization

```
Frontend/
├── src/
│   └── __tests__/
│       ├── unit/
│       │   ├── components/
│       │   │   ├── Navbar.test.jsx
│       │   │   ├── ResourceCard.test.jsx
│       │   │   └── FilterBar.test.jsx
│       │   ├── pages/
│       │   │   ├── Login.test.jsx
│       │   │   ├── Resources.test.jsx
│       │   │   └── Upload.test.jsx
│       │   └── utils/
│       │       └── auth.test.js
│       ├── properties/
│       │   ├── auth.properties.test.js
│       │   ├── routing.properties.test.js
│       │   ├── forms.properties.test.js
│       │   └── api.properties.test.js
│       └── integration/
│           ├── user-flow.test.js
│           └── admin-flow.test.js
└── e2e/
    ├── registration.spec.js
    ├── resource-browsing.spec.js
    └── admin-workflow.spec.js
```

### Testing Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Clear localStorage and reset mocks between tests
3. **Realistic Data**: Use realistic test data that matches production patterns
4. **Accessibility**: Include accessibility tests (aria labels, keyboard navigation)
5. **Performance**: Monitor test execution time and optimize slow tests
6. **Coverage**: Aim for >80% code coverage, but prioritize meaningful tests over coverage metrics

### Continuous Integration

- Run all tests on every pull request
- Block merges if tests fail
- Generate coverage reports
- Run E2E tests on staging environment before production deployment

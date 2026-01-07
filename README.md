# CRM Application

A robust Client Relationship Management (CRM) system built with the MERN stack (MongoDB, Express.js, React, Node.js). This project features role-based access control (Admin vs. Staff), lead management, and staff administration.

## 🚀 Technology Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (with Mongoose)
*   **Authentication**: JWT (JSON Web Tokens) stored in HTTP-Only Cookies
*   **Security**: Helmet, CORS, Bcrypt (Password Hashing)

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS v4 (using `@theme` directives)
*   **State Management**: Zustand
*   **Routing**: React Router DOM (v6)
*   **Forms**: Formik + Yup Validation
*   **HTTP Client**: Axios (configured with interceptors & credentials)
*   **Icons**: Lucide React
*   **Notifications**: React Hot Toast

---

## 🏗 Architecture & Folder Structure

### Backend (`/backend`)
*   `src/routes`: API route definitions.
*   `src/controllers`: Request handlers (business logic layer).
*   `src/services`: Database interaction and core logic (separation of concerns).
*   `src/models`: Mongoose schemas (Auth/User, Lead).
*   `src/middlewares`:
    *   `authMiddleware`: `protect` (verifies JWT) and `adminOnly` (RBAC).
    *   `errorMiddleware`: Centralized error handling.

### Frontend (`/frontend`)
*   `src/pages`: Main views (`Leads`, `Staff`, `Login`, `Register`).
*   `src/components`: Reusable UI components.
    *   **Smart Components**: `Table`, `DynamicFormModal`, `DynamicViewModal`.
    *   **UI Primitives**: `Button`, `Input`, `SearchBar`, `Modal`.
*   `src/features`: global state slices via Zustand (`authStore`, `leadStore`, `staffStore`).
*   `src/lib`: Configuration (Axios instance, Validation schemas).

---

## ✨ Features Implemented

### 1. Authentication & Security
*   **Secure Login/Register**: Users can sign up and log in.
*   **HTTP-Only Cookies**: JWT tokens are stored securely in cookies (not localStorage) to prevent XSS attacks.
*   **Role-Based Access Control (RBAC)**:
    *   **Admins**: Full access to all resources.
    *   **Staff**: Restricted access (cannot manage other staff, limited lead actions).
*   **Session Persistence**: `checkAuth` on app load verifies the session.

### 2. Lead Management
*   **View Leads**: Paginated list of leads with search functionality.
*   **Create/Edit Leads**: Admins can create and edit lead details.
*   **Lead Status**: Track status (New, Contacted, Qualified, Lost, Closed).
*   **Assignment**: Admins can assign leads to specific staff members.
*   **Notes System**: Staff and Admins can add notes to leads for tracking history.
*   **Reusable UI**: Built using the `Table` and `DynamicFormModal` components.

### 3. Staff Management (Admin Only)
*   **CRUD Operations**: Admins can Add, Edit, and Delete staff accounts.
*   **Client-Side Pagination**: Efficient client-side paging for staff lists.
*   **Security**: Staff passwords are hashed before storage; updates handle password changes securely.

---

## 📡 API Endpoints Summary

### Auth (`/api/auth`)
*   `POST /register`: Create a new user (default role: Staff).
*   `POST /login`: Authenticate and receive HTTP-only cookie.
*   `POST /logout`: Clear auth cookie.
*   `GET /me`: Get current authenticated user details.

### Leads (`/api/leads`)
*   `GET /`: Get paginated leads (Supports search query).
*   `POST /`: Create a new lead (**Admin Only**).
*   `GET /:id`: Get single lead details.
*   `PUT /:id`: Update lead details (**Admin Only**).
*   `DELETE /:id`: Remove a lead (**Admin Only**).
*   `PUT /:id/assign`: Assign lead to staff (**Admin Only**).
*   `POST /:id/notes`: Add a note to a lead.

### Staff (`/api/staff`) - **Admin Only**
*   `GET /`: List all staff members.
*   `POST /`: Create a new staff member.
*   `PUT /:id`: Update staff details.
*   `DELETE /:id`: Delete a staff member.

---

## 🛠 Reusable Components Guide

### `<Table />`
A configuration-driven table component.
```jsx
<Table
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Actions', render: (row) => <MyButtons row={row} /> }
  ]}
  data={dataArray}
  pagination={{ ... }}
/>
```

### `<DynamicFormModal />`
Wrapper around `Formik` and `Modal` for rapid CRUD forms.
```jsx
<DynamicFormModal
  isOpen={isOpen}
  fields={[
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'role', type: 'select', options: [...] }
  ]}
  validationSchema={Schema}
  onSubmit={handleSubmit}
/>
```

---

## 🏃‍♂️ How to Run

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🧠 Design Decisions

- Used a single User model with role-based access instead of separate Admin/Staff models to keep auth simple and scalable.
- Lead assignment is handled by storing `assignedTo` on the Lead document.
- Business logic is separated into services to keep controllers thin.
- HTTP-only cookies used to prevent XSS attacks.


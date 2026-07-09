# Restaurant Reservation Management System

A full-stack, production-quality, responsive web application for managing restaurant table reservations. The system features JWT-based authentication, Role-Based Access Control (RBAC) for Customers and Administrators, automatic table allocation, and real-time conflict detection.

---

## Folder Structure

```text
restaurant-res/
├── backend/
│   ├── src/
│   │   ├── config/       # Configurations (Database connection, DNS resolvers)
│   │   ├── controllers/  # Route handlers (auth, reservations, tables)
│   │   ├── middleware/   # Custom Express middlewares (auth, RBAC, error formatting)
│   │   ├── models/       # Database models (User, Table, Reservation)
│   │   ├── routes/       # Endpoint routing maps
│   │   ├── seed/         # Database table seed scripts
│   │   ├── services/     # Business logic layers (allocation algorithm, DB queries)
│   │   ├── utils/        # Utilities (JWT tokens helper)
│   │   └── validators/   # express-validator request input chains
│   ├── .env.example      # Environment variables template
│   ├── app.js            # Express app initialization
│   └── server.js         # Entry point script
│
├── frontend/
│   ├── src/
│   │   ├── api/          # API calls (Axios client and versioned endpoints)
│   │   ├── components/   # Reusable components and UI primitives (Button, Input, Card, Modals)
│   │   ├── context/      # React state provider (AuthContext)
│   │   ├── hooks/        # Custom React hooks (useReservations, useAdminReservations)
│   │   ├── layouts/      # Auth and Main page container wrappers
│   │   ├── pages/        # Login, Register, Customer and Admin Dashboards
│   │   └── routes/       # React Router path configurations
│   ├── .env.example      # Environment variables template
│   ├── vite.config.js    # Vite configurations (React + Tailwind CSS plugins)
│   └── index.html        # SPA root HTML template
│
└── README.md             # Project documentation (this file)
```

---

## Technology Stack

- **Backend**: Node.js, Express, Mongoose, MongoDB.
- **Frontend**: React (Vite), React Router DOM, Axios, React Hook Form, Tailwind CSS.
- **Security & Helpers**: JSON Web Tokens (JWT), Bcrypt.js, Helmet, Morgan, Cookie-Parser, express-async-handler, express-validator.

---

## Authentication & Authorization Flow

1. **Registration**: Clients supply name, email, and password. New users are assigned the `customer` role internally (preventing privilege escalation).
2. **Login & JWT**: Upon credentials verification (comparing bcrypt hashes via model instance methods), the backend signs a JWT containing only `{ id, role }` with a 7-day expiration.
3. **Storage & Interceptor**: The token is returned in the response body, stored in `localStorage`, and automatically attached to the `Authorization: Bearer <token>` header of every outgoing request via an Axios request interceptor.
4. **Session Restoration**: On startup, the application verifies the token validity by fetching the active user profile (`GET /api/v1/auth/profile`) before rendering routes.
5. **Route Guards**: React Router uses the custom `ProtectedRoute` to evaluate state:
   - Unauthenticated sessions are redirected to `/login`.
   - Accessing `/admin` routes requires the `admin` role, otherwise the user is redirected to their respective dashboard route.

---

## Table Seeding Layout

The system utilizes a fixed restaurant seating layout. Run the seed script once to initialize the tables:
- **2 tables**: Capacity 2 (Table numbers 1, 2)
- **3 tables**: Capacity 4 (Table numbers 3, 4, 5)
- **2 tables**: Capacity 6 (Table numbers 6, 7)
- **1 table**: Capacity 8 (Table number 8)

---

## Table Allocation Algorithm

When a booking request arrives, the backend dynamically assigns a table using the following deterministic steps:
1. **Query**: Retrieve all active tables (`isActive: true`) from the database.
2. **Filter**: Select tables with `capacity >= guestCount`.
3. **Sort**: Order candidate tables by `capacity` ascending (and `tableNumber` ascending secondary for determinism).
4. **Select**: Loop through the sorted tables, choosing the smallest suitable table first.
5. **Validate**: Verify if that table already has a booking (where `status !== 'CANCELLED'`) matching the requested date and time slot.
6. **Assign / Re-try**: If free, allocate this table. If occupied, proceed to check the next suitable table in the sorted list.
7. **Exhaustion**: If no tables are available, reject the request with a `409 Conflict` status code and a message.

---

## Conflict Detection & Normalization

- **Date Normalization**: All reservation dates are normalized to midnight UTC (`00:00:00.000Z`) during booking, searching, and filtering. This eliminates database timezone offset mismatches.
- **Conflict Rule**: A booking is blocked if there is another booking matching `table` + `reservationDate` + `timeSlot` where the status is **not** `CANCELLED`.
- **Cancellation**: Cancelled bookings (`status: 'CANCELLED'`) immediately free up the table for new reservations. Completed bookings remain in the database for tracking.

---

## API Overview

### Authentication
- `POST /api/v1/auth/register` (Public) - Create a customer account.
- `POST /api/v1/auth/login` (Public) - Sign in.
- `GET /api/v1/auth/profile` (Private) - Get logged-in user details.

### Customer Operations
- `POST /api/v1/reservations` (Private) - Book a table.
- `GET /api/v1/reservations/my` (Private) - View customer bookings.
- `DELETE /api/v1/reservations/:id` (Private) - Cancel own booking.

### Admin Operations
- `GET /api/v1/admin/reservations` (Private Admin) - View all bookings.
- `GET /api/v1/admin/reservations?date=YYYY-MM-DD` (Private Admin) - Filter bookings by date.
- `PATCH /api/v1/admin/reservations/:id` (Private Admin) - Edit date, time, party size, or status.
- `DELETE /api/v1/admin/reservations/:id` (Private Admin) - Cancel any booking.

### Tables
- `GET /api/v1/tables` (Private) - Get active tables.

---

## Installation & Running Locally

### Prerequisites
- Node.js installed locally.
- MongoDB installed locally or access to a MongoDB Atlas cluster URI.

### Step 1: Clone and Configure Environment Files

1. Configure the **Backend** environment variables:
   Create `backend/.env` using the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=supersecretkey12345
   NODE_ENV=development
   ```

2. Configure the **Frontend** environment variables:
   Create `frontend/.env` using the following:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Seed Tables

Run the seed script in the backend directory once before starting testing:
```bash
cd backend
node src/seed/table.seed.js
```

### Step 4: Run Development Servers

```bash
# Run backend dev server (port 5000)
cd backend
npm run dev

# Run frontend dev server (port 5173)
cd frontend
npm run dev
```

---

## Deployment Guide

### Backend: Render
1. Host the repository on GitHub.
2. Create a new **Web Service** on Render pointing to your repository.
3. Configure the build and start settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node src/server.js`
4. Set Environment Variables in Render Panel:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=10000` (or leave default)

### Frontend: Vercel
1. Create a new project in Vercel pointing to the repository.
2. Configure settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
3. Add Environment Variable:
   - `VITE_API_URL`: Set to your deployed Render URL (e.g. `https://your-backend.onrender.com/api/v1`).
4. Build and Deploy.

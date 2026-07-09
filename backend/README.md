# Restaurant Reservation Backend

Node.js, Express, and MongoDB backend for the Restaurant Reservation System.

## Project Structure

```text
backend/
├── src/
│   ├── config/            # Configurations (Database, etc.)
│   ├── controllers/       # Route request handlers
│   ├── middleware/        # Custom Express middlewares
│   ├── models/            # Database schemas/models
│   ├── routes/            # Express route declarations
│   ├── services/          # Business logic layers (empty)
│   ├── validators/        # Request schemas and validation (empty)
│   ├── utils/             # Helper utility functions (empty)
│   ├── seed/              # Database seeding scripts (empty)
│   ├── app.js             # Express application configuration
│   └── server.js          # App entry point
├── .env                   # Environment variables (local dev)
├── .env.example           # Environment template
├── .gitignore             # Git ignored patterns
├── package.json           # Node project manifest
└── README.md              # Project documentation
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your database and JWT secret details.
   ```bash
   cp .env.example .env
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Production Server**:
   ```bash
   npm start
   ```

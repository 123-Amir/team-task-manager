# Team Task Manager - Backend Setup

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (running locally or remote)
- npm

## Installation

All dependencies have been installed. If you need to reinstall:

```bash
npm install
```

## Environment Variables

Configure `.env` file with your database connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/team_task_manager"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
```

## Database Setup

Before running the server, initialize the database:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create database tables based on the schema
2. Generate Prisma Client

To view the database:

```bash
npx prisma studio
```

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma        # Database schema
├── routes/
│   └── auth.js              # Auth endpoints (signup, login)
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── index.js                 # Express app setup
├── server.js                # Server entry point
├── package.json
├── .env                     # Environment variables
└── .gitignore
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server

## API Endpoints

### Health Check
- `GET /health` - Returns `{ status: "ok" }`

### Authentication Routes
- `POST /api/auth/signup` - Create new user
  - Body: `{ name, email, password }`
  - Returns: `{ user: {id, name, email}, token }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user: {id, name, email}, token }`

## Database Models

### User
- id (String, unique)
- name (String)
- email (String, unique)
- passwordHash (String)
- createdAt (DateTime)

### Project
- id (String, unique)
- name (String)
- description (String, optional)
- createdBy (relation to User)
- createdAt (DateTime)

### ProjectMember
- id (String, unique)
- role (ADMIN | MEMBER)
- user (relation to User)
- project (relation to Project)

### Task
- id (String, unique)
- title (String)
- description (String, optional)
- status (TODO | IN_PROGRESS | DONE)
- dueDate (DateTime, optional)
- project (relation to Project)
- assignee (relation to User, optional)
- createdAt (DateTime)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is valid for 7 days.

## Running the Server

```bash
npm start
```

The server will start on the port specified in `.env` (default: 5000)

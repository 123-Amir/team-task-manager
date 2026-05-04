# Team Task Manager

A monorepo-style full-stack application for managing team tasks with role-based access control.

## Project Structure

```
team-task-manager/
├── server/          # Express + Prisma + PostgreSQL backend
├── client/          # React + Vite frontend
└── README.md
```

## Features

### Backend (Express + Prisma)
- ✅ User authentication with JWT
- ✅ Role-based access control (ADMIN, MEMBER)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Password hashing with bcrypt
- ✅ CORS enabled
- ✅ Project management
- ✅ Task management with status tracking
- ✅ Team member management
- ✅ Dashboard with statistics

### Frontend (React + Vite)
- ✅ Authentication (login/signup)
- ✅ Protected routes
- ✅ Project CRUD operations
- ✅ Task management
- ✅ Team member display
- ✅ Dashboard with task statistics
- ✅ Responsive UI with role-based features
- ✅ Real-time status updates

## Quick Start

### Prerequisites

- Node.js v16 or higher
- npm v8 or higher
- PostgreSQL (local or remote)

### 1. Backend Setup

```bash
cd server

# Install dependencies (already done)
npm install

# Configure database
# Edit .env with your PostgreSQL connection string:
# DATABASE_URL="postgresql://user:password@localhost:5432/team_task_manager"
# JWT_SECRET="your-secret-key"
# PORT=5000

# Initialize database
npx prisma migrate dev --name init

# Start server
npm start
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client

# Install dependencies (already done)
npm install

# Configure API URL (optional, already set to localhost:5000)
# Edit .env if your backend is on a different URL

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## Database Setup

### Create PostgreSQL Database

**Windows (with PostgreSQL installed):**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE team_task_manager;

# Exit
\q
```

**Update .env:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/team_task_manager"
```

### Run Migrations

```bash
cd server
npx prisma migrate dev --name init
```

### View Database (Optional)

```bash
cd server
npx prisma studio
```

Opens browser interface to view/edit data.

## API Endpoints

### Authentication

```
POST /api/auth/signup
  Body: { name, email, password }
  Response: { user: {id, name, email}, token }

POST /api/auth/login
  Body: { email, password }
  Response: { user: {id, name, email}, token }
```

### Projects

```
GET /api/projects
  Returns: All projects user is member of

POST /api/projects
  Body: { name, description }
  Returns: Created project

GET /api/projects/:id
  Returns: Project details with members and tasks

POST /api/projects/:id/members
  Body: { userId, role: "ADMIN" | "MEMBER" }
  Returns: Created member (admin only)

GET /api/projects/:id/members
  Returns: All members of project
```

### Tasks

```
POST /api/projects/:projectId/tasks
  Body: { title, description, dueDate, assigneeId }
  Returns: Created task

GET /api/projects/:projectId/tasks
  Returns: All tasks in project

PATCH /api/tasks/:id
  Body: { title, description, status, dueDate, assigneeId }
  Returns: Updated task (admin or assignee only)
```

### Dashboard

```
GET /api/dashboard/summary
  Returns: { totalTasks, byStatus: {TODO, IN_PROGRESS, DONE}, overdueTasks }
```

## Database Schema

### User
- `id` - Unique identifier (cuid)
- `name` - User's full name
- `email` - Unique email address
- `passwordHash` - Bcrypt hashed password
- `createdAt` - Account creation date

### Project
- `id` - Unique identifier
- `name` - Project name
- `description` - Optional project description
- `createdBy` - User ID of creator
- `createdAt` - Project creation date

### ProjectMember
- `id` - Unique identifier
- `userId` - User ID
- `projectId` - Project ID
- `role` - ADMIN or MEMBER
- Unique constraint on (userId, projectId)

### Task
- `id` - Unique identifier
- `title` - Task title
- `description` - Optional task description
- `status` - TODO, IN_PROGRESS, or DONE
- `dueDate` - Optional due date
- `projectId` - Associated project
- `assigneeId` - Optional assigned user
- `createdAt` - Task creation date

## Available Scripts

### Backend

```bash
cd server
npm start           # Start production server
npm run dev         # Start development server (same for now)
npx prisma migrate dev --name <name>  # Create migration
npx prisma generate   # Generate Prisma client
npx prisma studio    # View database UI
npx prisma db reset  # Reset database (dev only)
```

### Frontend

```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Environment Variables

### Server (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/team_task_manager
JWT_SECRET=your-secret-key-here
PORT=5000
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000
```

## Authentication Flow

1. User signs up with name, email, password
2. Backend hashes password with bcrypt
3. User record created in database
4. JWT token generated and returned
5. Token stored in localStorage on client
6. All API requests include JWT in Authorization header
7. Backend verifies JWT on protected routes
8. Token expires in 7 days

## Role-Based Access Control

### ADMIN Role
- Create projects
- Add/remove team members
- Update any task
- Manage project settings

### MEMBER Role
- View project details
- Create tasks
- Update own assigned tasks
- Update task status

## Testing the App

### Create Test Account

```
Email: test@example.com
Password: password123
Name: Test User
```

### Test Workflow

1. Sign up with test account
2. Create a project
3. View project details
4. Create tasks within project
5. Update task status
6. View dashboard statistics

## Troubleshooting

### Database Connection Error

```
Make sure PostgreSQL is running:
- Windows: Services > PostgreSQL > Start
- Check DATABASE_URL in .env is correct
```

### Port Already in Use

```
Backend: Change PORT in .env
Frontend: Vite will auto-increment port
```

### JWT Errors

```
Make sure JWT_SECRET is set in .env
Token stored in localStorage can be cleared from DevTools
```

### CORS Errors

```
Make sure backend CORS is enabled (already configured)
Check VITE_API_URL matches backend address
```

## Development Tips

- Use Prisma Studio to inspect database: `npx prisma studio`
- Check browser DevTools > Application > LocalStorage for auth token
- Use Postman to test backend API directly
- Frontend logs show API errors in console
- Backend logs show request details

## Deployment

### Backend
- Deploy to Heroku, Railway, Render, etc.
- Update DATABASE_URL and JWT_SECRET in production
- Ensure Node.js version matches requirements

### Frontend
- Build: `npm run build`
- Deploy dist/ folder to Vercel, Netlify, etc.
- Update VITE_API_URL to production backend URL

## Tech Stack

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

**Frontend:**
- React 18
- Vite
- React Router v6
- Axios
- CSS3

## Next Steps

1. ✅ Backend API complete
2. ✅ Frontend UI complete
3. ⏳ Add project deletion
4. ⏳ Add member removal
5. ⏳ Add task comments
6. ⏳ Add notifications
7. ⏳ Add file uploads
8. ⏳ Deploy to production

## License

MIT

---

For detailed backend setup, see [server/README.md](server/README.md)
For detailed frontend setup, see [client/README.md](client/README.md)

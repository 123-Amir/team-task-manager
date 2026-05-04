# Complete Setup Guide - Team Task Manager

## Prerequisites

Before starting, ensure you have:
- **Node.js** v16+ ([download](https://nodejs.org/))
- **npm** v8+ (comes with Node.js)
- **PostgreSQL** installed ([download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)

## Step 1: Start PostgreSQL

### Windows

1. Open Services (services.msc)
2. Find "PostgreSQL" service
3. Right-click → Start (if not already running)
4. Or use command line:
   ```bash
   net start postgresql-x64-15  # Replace version number as needed
   ```

### macOS

```bash
brew services start postgresql
```

### Linux

```bash
sudo systemctl start postgresql
```

## Step 2: Create Database

Open PowerShell/Terminal and create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE team_task_manager;

# Verify creation
\l

# Exit
\q
```

## Step 3: Backend Setup

### 3.1 Configure Environment

```bash
cd server

# Edit .env file
# Add your database connection string
```

**Example .env:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/team_task_manager"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=5000
```

Replace:
- `postgres` with your PostgreSQL username
- `password` with your PostgreSQL password
- `your-super-secret-key-change-in-production` with a strong secret

### 3.2 Initialize Database

```bash
cd server

# Create database tables
npx prisma migrate dev --name init

# You may be prompted to generate Prisma Client - accept (y)
```

### 3.3 Verify Database (Optional)

```bash
# Open Prisma Studio to view database
npx prisma studio
```

This opens browser at `http://localhost:5555` to view/manage data

### 3.4 Start Backend Server

```bash
cd server

# Terminal 1: Start the server
npm start

# Expected output:
# Server is running on port 5000
```

Keep this terminal open while developing.

## Step 4: Frontend Setup

### 4.1 Install Dependencies

```bash
cd client

npm install
```

### 4.2 Verify API URL (Optional)

Check `.env` file - it should have:
```
VITE_API_URL=http://localhost:5000
```

If your backend is on a different URL, update this.

### 4.3 Start Frontend Server

```bash
cd client

# Terminal 2 (new terminal): Start the dev server
npm run dev

# Expected output:
# VITE v5.0.0  ready in 123 ms
# ➜  Local:   http://localhost:5173/
```

## Step 5: Test the Application

### 5.1 Create Account

1. Open `http://localhost:5173` in browser
2. Click "Sign up"
3. Enter details:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign Up"

### 5.2 Create Project

1. You'll be redirected to Projects page
2. Click "+ New Project"
3. Enter:
   - Name: `My First Project`
   - Description: `Testing the app`
4. Click "Create"

### 5.3 Create Task

1. Click on the project
2. Click "+ Add Task"
3. Enter:
   - Title: `Setup documentation`
   - Description: `Complete the setup guide`
   - Due Date: `2026-05-15`
4. Click "Create Task"

### 5.4 View Dashboard

1. Click "Dashboard" in top navigation
2. View your task statistics

## Terminal Setup (Recommended)

For easier development, open 2-3 terminals:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 - Database (Optional):**
```bash
cd server
npx prisma studio
```

## Common Issues & Solutions

### Issue: "Cannot connect to PostgreSQL"

**Solution:**
1. Verify PostgreSQL is running: `psql -U postgres`
2. Check DATABASE_URL is correct
3. Ensure database exists: `psql -U postgres -c "\l"`
4. Create if missing: `createdb team_task_manager`

### Issue: "Port 5000 already in use"

**Solution:**
1. Change PORT in .env
2. Or kill the process using the port

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue: "VITE_API_URL not found"

**Solution:**
Check `.env` file exists in client folder with:
```
VITE_API_URL=http://localhost:5000
```

### Issue: "JWT Token errors"

**Solution:**
1. Clear localStorage: DevTools → Application → LocalStorage → Clear All
2. Log out and log back in
3. Verify JWT_SECRET in server/.env is set

## Database Management

### View/Edit Data

```bash
cd server
npx prisma studio
```

Opens browser interface to manage data.

### Reset Database (Development Only)

```bash
cd server
npx prisma migrate reset

# Confirm with 'y' when prompted
```

This will:
- Delete all data
- Re-run all migrations
- Reseed database (if seeds configured)

### Create Migration After Schema Changes

```bash
cd server
npx prisma migrate dev --name <descriptive_name>

# Example:
# npx prisma migrate dev --name add_task_comments
```

## API Testing with Postman

### 1. Import API Endpoints

Create requests for:

**Signup:**
- URL: `POST http://localhost:5000/api/auth/signup`
- Body:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Login:**
- URL: `POST http://localhost:5000/api/auth/login`
- Body:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Create Project:**
- URL: `POST http://localhost:5000/api/projects`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "name": "My Project",
    "description": "Project description"
  }
  ```

### 2. Add Bearer Token

After login, copy the token from response and add to Authorization header:
```
Authorization: Bearer <paste_token_here>
```

## Production Deployment

### Backend (Heroku Example)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET="production-secret-key"
```

### Frontend (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
# VITE_API_URL=https://your-backend-app.herokuapp.com
```

## Development Workflow

### Making Changes

1. Edit files in `src/`
2. Frontend: Changes hot-reload automatically
3. Backend: Restart server with `npm start`
4. Database: Use `npx prisma migrate dev` after schema changes

### Adding New Features

1. **Backend:**
   - Update `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name <name>`
   - Create route in `routes/`
   - Import and mount in `index.js`
   - Restart server

2. **Frontend:**
   - Create component in `src/pages/` or `src/components/`
   - Add route in `App.jsx`
   - Import API functions from `api.js`
   - Component hot-reloads automatically

## Project Structure Reference

```
team-task-manager/
├── server/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── routes/
│   │   ├── auth.js               # Authentication
│   │   ├── projects.js           # Projects
│   │   ├── tasks.js              # Tasks
│   │   └── dashboard.js          # Dashboard
│   ├── middleware/
│   │   ├── auth.js               # JWT middleware
│   │   └── role.js               # Role checks
│   ├── index.js                  # Express app
│   ├── server.js                 # Entry point
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── App.jsx               # Main app
│   │   ├── AuthContext.jsx       # Auth state
│   │   ├── PrivateRoute.jsx      # Protected routes
│   │   ├── api.js                # API client
│   │   └── App.css               # Styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
└── README.md                     # This file
```

## Next Steps

1. ✅ Setup PostgreSQL
2. ✅ Configure backend
3. ✅ Initialize database
4. ✅ Start backend server
5. ✅ Start frontend server
6. ✅ Create account
7. ✅ Create projects and tasks
8. → Customize for your needs
9. → Deploy to production
10. → Add more features

## Support

For issues:
1. Check terminal output for error messages
2. Review this guide's "Common Issues" section
3. Check browser DevTools Console for errors
4. Inspect network requests in DevTools Network tab
5. Review Prisma documentation: https://www.prisma.io/docs/

## Additional Resources

- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [JWT](https://jwt.io/)

Good luck! 🚀

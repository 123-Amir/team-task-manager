# Team Task Manager - Frontend

A React + Vite frontend for managing team tasks with role-based access control.

## Setup

### Install Dependencies

```bash
npm install
```

### Configuration

Update `.env` with your backend URL:

```
VITE_API_URL=http://localhost:5000
```

## Development

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Features

### Authentication
- User signup and login
- JWT token-based authentication
- Automatic token attachment to API requests
- Protected routes with automatic redirection

### Projects
- Create and manage projects
- View all projects you're a member of
- Project details with members and tasks
- Role-based access (ADMIN/MEMBER)

### Tasks
- Create tasks within projects
- Update task status (TODO, IN_PROGRESS, DONE)
- Assign tasks to team members
- Set due dates for tasks
- Task edit permissions based on role and assignment

### Dashboard
- View task statistics across all projects
- See task breakdown by status
- Monitor overdue tasks
- Quick overview of workload

## Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── Projects.jsx        # Projects list
│   │   ├── ProjectDetail.jsx   # Project detail with tasks
│   │   └── Dashboard.jsx       # Dashboard summary
│   ├── App.jsx                 # Main app with routing
│   ├── App.css                 # Global styles
│   ├── main.jsx                # Entry point
│   ├── AuthContext.jsx         # Auth state management
│   ├── PrivateRoute.jsx        # Protected route component
│   └── api.js                  # Axios API client
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
├── .env
└── .gitignore
```

## API Integration

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/members` - Add member to project
- `GET /api/projects/:id/members` - Get project members

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get project tasks
- `PATCH /api/tasks/:id` - Update task

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard statistics

## Styling

The frontend uses a clean, simple CSS styling system with:
- Cards for content containers
- Badges for status and role indicators
- Responsive grid layouts
- Color-coded status indicators
- Accessible form elements

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:5000)

## Technologies

- React 18
- Vite
- React Router v6
- Axios
- CSS3

## Notes

- JWT tokens are stored in localStorage
- Automatic token attachment to API requests via Axios interceptor
- Protected routes redirect to login if not authenticated
- Role-based UI hiding for admin-only features

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { PrivateRoute } from './PrivateRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const { user } = useAuth()

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/projects" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/projects" /> : <Signup />} />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PrivateRoute>
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? '/projects' : '/login'} replace />} />
      </Routes>
    </div>
  )
}

export default App

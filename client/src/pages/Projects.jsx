import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/projects')
      setProjects(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      setProjects([])
      setError(err.response?.data?.error || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.post('/api/projects', formData)
      setProjects([...projects, response.data])
      setFormData({ name: '', description: '' })
      setShowForm(false)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-nav">
          <h1>Projects</h1>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <span>{user?.name}</span>
            <button
              className="logout-btn"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Project
        </button>
      )}

      {showForm && (
        <div className="card">
          <h2>Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ name: '', description: '' })
                }}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {projects.map((project) => {
            const memberCount = Array.isArray(project.members) ? project.members.length : 0
            const taskCount = Array.isArray(project.tasks) ? project.tasks.length : 0

            return (
              <div key={project.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${project.id}`)}>
                <h3>{project.name}</h3>
                <p>{project.description || 'No description'}</p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  {memberCount} member{memberCount !== 1 ? 's' : ''} • {taskCount} task{taskCount !== 1 ? 's' : ''}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

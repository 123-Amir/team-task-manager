import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', assigneeId: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/projects/${id}`)
      setProject(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      setError('Task title is required')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.post(`/api/projects/${id}/tasks`, taskForm)
      setProject({
        ...project,
        tasks: [...(project.tasks || []), response.data]
      })
      setTaskForm({ title: '', description: '', dueDate: '', assigneeId: '' })
      setShowTaskForm(false)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await api.patch(`/api/tasks/${taskId}`, updates)
      setProject({
        ...project,
        tasks: project.tasks.map(t => t.id === taskId ? response.data : t)
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task')
    }
  }

  if (loading) return <div className="container"><div style={{ padding: '20px' }}>Loading...</div></div>
  if (error) return <div className="container"><div className="error-message">{error}</div></div>
  if (!project) return <div className="container"><div>Project not found</div></div>

  const isAdmin = project.currentUserRole === 'ADMIN'

  return (
    <div className="container">
      <div className="header">
        <div className="header-nav">
          <h1>{project.name}</h1>
          <div className="nav-links">
            <Link to="/projects">Projects</Link>
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

      <div className="card">
        <h2>Project Details</h2>
        <p><strong>Description:</strong> {project.description || 'No description'}</p>
        <p><strong>Created by:</strong> {project.creator?.name}</p>
        <p><strong>Your role:</strong> <span className={`badge badge-${project.currentUserRole?.toLowerCase()}`}>{project.currentUserRole}</span></p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3>Members ({project.members?.length || 0})</h3>
          <table className="table" style={{ fontSize: '14px' }}>
            <tbody>
              {project.members?.map(member => (
                <tr key={member.id}>
                  <td>{member.user?.name}</td>
                  <td><span className={`badge badge-${member.role?.toLowerCase()}`}>{member.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Task Summary</h3>
          <table className="table" style={{ fontSize: '14px' }}>
            <tbody>
              <tr>
                <td>Total Tasks:</td>
                <td><strong>{project.tasks?.length || 0}</strong></td>
              </tr>
              <tr>
                <td>Todo:</td>
                <td><strong>{project.tasks?.filter(t => t.status === 'TODO').length || 0}</strong></td>
              </tr>
              <tr>
                <td>In Progress:</td>
                <td><strong>{project.tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0}</strong></td>
              </tr>
              <tr>
                <td>Done:</td>
                <td><strong>{project.tasks?.filter(t => t.status === 'DONE').length || 0}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Tasks</h3>
          {!showTaskForm && <button className="btn btn-primary btn-sm" onClick={() => setShowTaskForm(true)}>+ Add Task</button>}
        </div>

        {showTaskForm && (
          <form onSubmit={handleCreateTask} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ddd' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Due Date (optional)</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Assign to (optional)</label>
              <select
                value={taskForm.assigneeId}
                onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
                disabled={submitting}
              >
                <option value="">Unassigned</option>
                {project.members?.map(member => (
                  <option key={member.user.id} value={member.user.id}>{member.user.name}</option>
                ))}
              </select>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTaskForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {project.tasks && project.tasks.length === 0 ? (
          <p style={{ color: '#999' }}>No tasks yet. Create one to get started!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks?.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    {isAdmin || task.assigneeId === user?.id ? (
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                        style={{ padding: '4px' }}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    ) : (
                      <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                    )}
                  </td>
                  <td>{task.assignee?.name || 'Unassigned'}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

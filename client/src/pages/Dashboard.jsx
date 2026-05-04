import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import api from '../api'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/dashboard/summary')
      setSummary(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-nav">
          <h1>Dashboard</h1>
          <div className="nav-links">
            <Link to="/projects">Projects</Link>
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

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard...</div>
      ) : summary ? (
        <>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-label">Total Tasks</div>
              <div className="stat-number">{summary.totalTasks}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">To Do</div>
              <div className="stat-number" style={{ color: '#6c757d' }}>
                {summary.byStatus.TODO}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">In Progress</div>
              <div className="stat-number" style={{ color: '#ffc107' }}>
                {summary.byStatus.IN_PROGRESS}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Done</div>
              <div className="stat-number" style={{ color: '#28a745' }}>
                {summary.byStatus.DONE}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Overdue Tasks</div>
              <div className="stat-number" style={{ color: '#dc3545' }}>
                {summary.overdueTasks}
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Task Status Breakdown</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="badge badge-todo">TODO</span>
                  </td>
                  <td>{summary.byStatus.TODO}</td>
                  <td>
                    {summary.totalTasks > 0
                      ? ((summary.byStatus.TODO / summary.totalTasks) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-in-progress">IN_PROGRESS</span>
                  </td>
                  <td>{summary.byStatus.IN_PROGRESS}</td>
                  <td>
                    {summary.totalTasks > 0
                      ? ((summary.byStatus.IN_PROGRESS / summary.totalTasks) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="badge badge-done">DONE</span>
                  </td>
                  <td>{summary.byStatus.DONE}</td>
                  <td>
                    {summary.totalTasks > 0
                      ? ((summary.byStatus.DONE / summary.totalTasks) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {summary.overdueTasks > 0 && (
            <div className="card" style={{ borderLeft: '4px solid #dc3545' }}>
              <h3 style={{ color: '#dc3545' }}>⚠️ Warning: {summary.overdueTasks} Overdue Task{summary.overdueTasks !== 1 ? 's' : ''}</h3>
              <p>You have {summary.overdueTasks} task{summary.overdueTasks !== 1 ? 's' : ''} that are past their due date and not yet completed.</p>
              <Link to="/projects" className="btn btn-danger">View Projects</Link>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}

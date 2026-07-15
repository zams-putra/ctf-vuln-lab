import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import styles from './Admin.module.css'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState('app.log')
  const [input, setInput] = useState('app.log')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/')
    }
  }, [user, navigate])

  const fetchLog = async (filename) => {
    setLoading(true)
    setError('')
    setContent('')
    try {
      const text = await api.getAdminLogs(filename)
      setContent(text)
    } catch (err) {
      setError(err.message || 'Failed to load log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.isAdmin) fetchLog(file)
  }, [file, user])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFile(input.trim())
  }

  if (!user?.isAdmin) return null

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.adminBadge}>Admin</div>
            <h1 className={styles.title}>System Logs</h1>
          </div>
          <p className={styles.sub}>
            Read log files from the server. Specify a filename below.
          </p>
        </div>

        <div className={styles.toolbar}>
          <form onSubmit={handleSubmit} className={styles.fileForm}>
            <label className={styles.fileLabel}>Log file</label>
            <div className={styles.fileRow}>
              <span className={styles.filePrefix}>/var/log/cave/</span>
              <input
                className={styles.fileInput}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="app.log"
                spellCheck={false}
              />
              <button type="submit" className={styles.loadBtn}>
                Load
              </button>
            </div>
          </form>

          <div className={styles.quickLinks}>
            {['app.log', 'access.log', 'error.log'].map(f => (
              <button
                key={f}
                className={`${styles.quickBtn} ${file === f ? styles.quickBtnActive : ''}`}
                onClick={() => { setInput(f); setFile(f) }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.logBox}>
          <div className={styles.logHeader}>
            <span className={styles.logTitle}>{file}</span>
            <span className={styles.logLines}>
              {content ? `${content.split('\n').length} lines` : '—'}
            </span>
          </div>
          <div className={styles.logBody}>
            {loading ? (
              <span className={styles.logMuted}>Loading...</span>
            ) : error ? (
              <span className={styles.logError}>{error}</span>
            ) : content ? (
              <pre className={styles.logContent}>{content}</pre>
            ) : (
              <span className={styles.logMuted}>No content</span>
            )}
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Logged in as</div>
            <div className={styles.infoValue}>{user.username}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Role</div>
            <div className={styles.infoValue}>Administrator</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>User ID</div>
            <div className={styles.infoValue}>{user.id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

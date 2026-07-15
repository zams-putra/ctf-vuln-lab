import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import styles from './Roasting.module.css'

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function initials(name) {
  return name?.slice(0, 2).toUpperCase() || '??'
}


const AVATAR_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2b2d42', '#3d405b', '#264653', '#2a9d8f'
]
function avatarColor(name) {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function Roasting() {
  const { user } = useAuth()
  const [roastings, setRoastings] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const fetchRoastings = async () => {
    try {
      const data = await api.getRoastings()
      setRoastings(Array.isArray(data) ? data.reverse() : [])
    } catch {
      setError('Failed to load roastings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoastings()
    const interval = setInterval(fetchRoastings, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      await api.addRoasting(comment)
      setComment('')
      await fetchRoastings()
    } catch (err) {
      setSubmitError(err.message || 'Failed to post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Roasting Wall</h1>
          <p className={styles.sub}>
            {roastings.length} roast{roastings.length !== 1 ? 's' : ''} and counting
          </p>
          <p className={styles.sub}>
            Note: admin always visiting this page silently 😜
          </p>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div
                className={styles.formAvatar}
                style={{ background: avatarColor(user.username) }}
              >
                {initials(user.username)}
              </div>
              <div className={styles.formRight}>
                <textarea
                  className={styles.textarea}
                  placeholder="Drop your roast here..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <div className={styles.formFooter}>
                  <span className={styles.charCount}>{comment.length}/500</span>
                  {submitError && <span className={styles.submitError}>{submitError}</span>}
                  <button
                    type="submit"
                    className={styles.postBtn}
                    disabled={submitting || !comment.trim()}
                  >
                    {submitting ? 'Posting...' : 'Post Roast'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <Link to="/login" className={styles.loginLink}>Sign in</Link> to drop a roast
          </div>
        )}

        <div className={styles.feed}>
          {loading ? (
            <div className={styles.empty}>Loading...</div>
          ) : error ? (
            <div className={styles.empty}>{error}</div>
          ) : roastings.length === 0 ? (
            <div className={styles.empty}>No roasts yet. Be the first.</div>
          ) : (
            roastings.map(r => (
              <div key={r.id} className={styles.item}>
                <div
                  className={styles.itemAvatar}
                  style={{ background: avatarColor(r.roaster) }}
                >
                  {initials(r.roaster)}
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemUser}>{r.roaster}</span>
                    <span className={styles.itemTime}>{timeAgo(r.created_at)}</span>
                  </div>
  
                  <p
                    className={styles.itemText}
                    dangerouslySetInnerHTML={{ __html: r.comment }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

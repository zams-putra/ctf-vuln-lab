import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>◆</span>
          Cave
        </Link>

        <div className={styles.links}>
          <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Home
          </Link>
          <Link to="/roasting" className={`${styles.link} ${isActive('/roasting') ? styles.active : ''}`}>
            Roasting
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className={`${styles.link} ${styles.adminLink} ${isActive('/admin') ? styles.active : ''}`}>
              Admin
            </Link>
          )}
        </div>

        <div className={styles.auth}>
          {user ? (
            <>
              <span className={styles.username}>{user.username}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

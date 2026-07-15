import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import styles from './Landing.module.css'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>Welcome to Cave</div>
          <h1 className={styles.title}>
            A place to roast,<br />
            <span className={styles.titleAccent}>and get roasted.</span>
          </h1>
          <p className={styles.subtitle}>
            Drop your hottest takes. Roast others. Survive the cave.
            No filters, no mercy — just pure, unfiltered opinions.
          </p>
          <div className={styles.actions}>
            {user ? (
              <Link to="/roasting" className={styles.primaryBtn}>
                Go to Roasting →
              </Link>
            ) : (
              <>
                <Link to="/register" className={styles.primaryBtn}>
                  Get Started →
                </Link>
                <Link to="/login" className={styles.secondaryBtn}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>R</div>
              <div>
                <div className={styles.cardUser}>Rusdi</div>
                <div className={styles.cardTime}>2 minutes ago</div>
              </div>
            </div>
            <p className={styles.cardText}>
              your code has more bugs than a rainforest at night 🦟
            </p>
          </div>

          <div className={`${styles.card} ${styles.cardOffset}`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.avatar} ${styles.avatarB}`}>G</div>
              <div>
                <div className={styles.cardUser}>Gatot</div>
                <div className={styles.cardTime}>1 minute ago</div>
              </div>
            </div>
            <p className={styles.cardText}>
              at least my code compiles on the first try, unlike your excuses
            </p>
          </div>

          <div className={`${styles.card} ${styles.cardOffset2}`}>
            <div className={styles.cardHeader}>
              <div className={`${styles.avatar} ${styles.avatarC}`}>P</div>
              <div>
                <div className={styles.cardUser}>PriaSolo</div>
                <div className={styles.cardTime}>just now</div>
              </div>
            </div>
            <p className={styles.cardText}>
              i've seen better architecture in a sandbox 💀
            </p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>◈</div>
            <h3>Post Roasts</h3>
            <p>Share your sharpest takes with the community</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>◎</div>
            <h3>Stay Anonymous</h3>
            <p>Register with any username, no real identity needed</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>◉</div>
            <h3>Live Feed</h3>
            <p>See all roasts in real-time as they come in</p>
          </div>
        </div>
      </section>
    </div>
  )
}

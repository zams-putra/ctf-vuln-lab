import { createContext, useContext, useState, useEffect } from 'react'

const AuthCtx = createContext(null)

function parseJWT(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
   
    fetch('/api/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(claims => { if (claims) setUser(claims) })
      .catch(() => {})
  }, [])

  const login = (claims) => setUser(claims)

  const logout = () => {
    document.cookie = 'kuki=; Max-Age=0; path=/'
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)

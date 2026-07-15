const BASE = '/api'

async function req(method, path, body) {
  const opts = {
    method,
    credentials: 'include',
    headers: {}
  }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(BASE + path, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw { status: res.status, message: data.messages || 'Something went wrong' }
  return data
}

export const api = {
  register: (username, password) => req('POST', '/register', { username, password }),
  login: (username, password) => req('POST', '/login', { username, password }),
  getRoastings: () => req('GET', '/roasting'),
  addRoasting: (comment) => req('POST', '/roasting', { comment }),
  getAdminLogs: (file) => {
    const params = file ? `?file=${encodeURIComponent(file)}` : ''
    return fetch(`${BASE}/admin/logs${params}`, { credentials: 'include' }).then(res => {
      if (!res.ok) throw { status: res.status, message: 'Access denied' }
      return res.text()
    })
  }
}

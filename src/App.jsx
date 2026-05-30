import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Feed from './components/Feed'

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  title: { margin: 0, fontSize: '22px' },
  userInfo: { fontSize: '14px', color: '#555' },
  logoutBtn: {
    marginLeft: '10px',
    padding: '4px 10px',
    cursor: 'pointer',
    background: '#e0245e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div style={styles.container}>読み込み中...</div>

  if (!session) return <Auth />

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>X Clone</h1>
        <div>
          <span style={styles.userInfo}>{session.user.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>ログアウト</button>
        </div>
      </div>
      <Feed session={session} />
    </div>
  )
}

import { useState } from 'react'
import { supabase } from '../supabaseClient'

const styles = {
  wrapper: {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
  },
  title: { textAlign: 'center', marginBottom: '24px' },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  btn: {
    width: '100%',
    padding: '10px',
    background: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    marginBottom: '8px',
  },
  toggle: {
    background: 'none',
    border: 'none',
    color: '#1da1f2',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto',
    fontSize: '13px',
  },
  error: { color: 'red', fontSize: '13px', marginBottom: '8px' },
  message: { color: 'green', fontSize: '13px', marginBottom: '8px' },
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('確認メールを送りました。メールをチェックしてください。')
    }

    setLoading(false)
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>{isLogin ? 'ログイン' : '新規登録'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.message}>{message}</p>}
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? '処理中...' : isLogin ? 'ログイン' : '登録する'}
        </button>
      </form>
      <button style={styles.toggle} onClick={() => { setIsLogin(!isLogin); setError(''); setMessage('') }}>
        {isLogin ? '→ アカウントを作成する' : '→ ログインする'}
      </button>
    </div>
  )
}

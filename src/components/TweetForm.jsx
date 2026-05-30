import { useState } from 'react'
import { supabase } from '../supabaseClient'

const MAX_LEN = 280

const styles = {
  form: {
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
    resize: 'vertical',
    minHeight: '80px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '8px',
    gap: '10px',
  },
  counter: { fontSize: '13px', color: '#777' },
  btn: {
    padding: '8px 18px',
    background: '#1da1f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  btnDisabled: {
    padding: '8px 18px',
    background: '#9dc8e2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'not-allowed',
  },
  error: { color: 'red', fontSize: '13px' },
}

export default function TweetForm({ session, onPosted }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')

    const { error } = await supabase.from('tweets').insert({
      content: trimmed,
      user_id: session.user.id,
      user_email: session.user.email,
    })

    if (error) {
      setError('投稿に失敗しました: ' + error.message)
    } else {
      setContent('')
      onPosted()
    }

    setLoading(false)
  }

  const remaining = MAX_LEN - content.length
  const canPost = content.trim().length > 0 && remaining >= 0 && !loading

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <textarea
        style={styles.textarea}
        placeholder="いまどうしてる？"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={MAX_LEN}
      />
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.footer}>
        <span style={{ ...styles.counter, color: remaining < 20 ? '#e0245e' : '#777' }}>
          {remaining}
        </span>
        <button
          type="submit"
          style={canPost ? styles.btn : styles.btnDisabled}
          disabled={!canPost}
        >
          {loading ? '投稿中...' : 'つぶやく'}
        </button>
      </div>
    </form>
  )
}

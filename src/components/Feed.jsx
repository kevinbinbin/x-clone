import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import TweetForm from './TweetForm'

const styles = {
  tweet: {
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '12px',
  },
  meta: {
    fontSize: '12px',
    color: '#777',
    marginBottom: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: { fontSize: '15px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#e0245e',
    cursor: 'pointer',
    fontSize: '12px',
  },
  empty: { color: '#aaa', textAlign: 'center', marginTop: '40px' },
}

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleString('ja-JP')
}

export default function Feed({ session }) {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTweets = async () => {
    const { data, error } = await supabase
      .from('tweets')
      .select('id, content, created_at, user_id, user_email')
      .order('created_at', { ascending: false })
    if (!error) setTweets(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTweets()

    const channel = supabase
      .channel('tweets-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tweets' }, fetchTweets)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const handleDelete = async (id) => {
    await supabase.from('tweets').delete().eq('id', id)
  }

  if (loading) return <p>読み込み中...</p>

  return (
    <div>
      <TweetForm session={session} onPosted={fetchTweets} />
      {tweets.length === 0 && <p style={styles.empty}>まだつぶやきがありません</p>}
      {tweets.map((tweet) => (
        <div key={tweet.id} style={styles.tweet}>
          <div style={styles.meta}>
            <span>{tweet.user_email}</span>
            <span>
              {formatDate(tweet.created_at)}
              {tweet.user_id === session.user.id && (
                <button style={styles.deleteBtn} onClick={() => handleDelete(tweet.id)}>削除</button>
              )}
            </span>
          </div>
          <div style={styles.content}>{tweet.content}</div>
        </div>
      ))}
    </div>
  )
}

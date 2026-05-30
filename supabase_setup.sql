-- ① tweets テーブルを作成
CREATE TABLE IF NOT EXISTS public.tweets (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email  TEXT        NOT NULL,
  content     TEXT        NOT NULL CHECK (char_length(content) <= 280),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ② Row Level Security を有効化
ALTER TABLE public.tweets ENABLE ROW LEVEL SECURITY;

-- ③ 全員が読める
CREATE POLICY "誰でも閲覧可能" ON public.tweets
  FOR SELECT USING (true);

-- ④ ログイン済みユーザーだけ投稿できる
CREATE POLICY "ログイン済みユーザーが投稿可能" ON public.tweets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ⑤ 自分の投稿だけ削除できる
CREATE POLICY "自分の投稿のみ削除可能" ON public.tweets
  FOR DELETE USING (auth.uid() = user_id);

-- ⑥ リアルタイム機能を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.tweets;

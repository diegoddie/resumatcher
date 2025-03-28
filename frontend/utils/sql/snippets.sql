CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT AS $$
    SELECT NULLIF(
        current_setting('request.jwt.claims', true)::json->>'sub',
        ''
    )::text;
$$ LANGUAGE SQL STABLE;

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT requesting_user_id(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE job_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL,
  years_experience INT,
  location TEXT,
  filename TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT UNIQUE,
  years_experience INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  salary TEXT,
  url TEXT
);

CREATE TABLE match_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  score INT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_post_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_report_id UUID NOT NULL REFERENCES job_reports(id) ON DELETE CASCADE
);

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  payment_provider TEXT,
  payment_id TEXT,
  credits INT NOT NULL DEFAULT 3
);

CREATE TABLE job_report_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_report_id UUID NOT NULL REFERENCES job_reports(id) ON DELETE CASCADE,
  job_post_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  UNIQUE(job_report_id, job_post_id) -- Evita duplicati
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_report_posts ENABLE ROW LEVEL SECURITY;

-- Policy for users table - users can only read and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT TO authenticated
  USING (requesting_user_id() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE TO authenticated
  USING (requesting_user_id() = id);

CREATE POLICY "Users can delete own profile"
  ON public.users
  FOR DELETE TO authenticated
  USING (requesting_user_id() = id);

CREATE POLICY "Users can update own subscription"
  ON public.subscriptions
  FOR UPDATE TO authenticated
  USING (requesting_user_id() = user_id);

-- Policy for job_reports table - users can manage their own reports
CREATE POLICY "Users can view own job reports" 
  ON public.job_reports 
  FOR SELECT TO authenticated
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can create job reports" 
  ON public.job_reports 
  FOR INSERT TO authenticated
  WITH CHECK (requesting_user_id() = user_id);

-- Policy for job_posts table - read-only for authenticated users
CREATE POLICY "Authenticated users can view job posts" 
  ON job_posts 
  FOR SELECT 
  USING (requesting_user_id() IS NOT NULL);

-- Policy for match_scores table - users can manage their own scores
CREATE POLICY "Users can view own match scores" 
  ON public.match_scores 
  FOR SELECT TO authenticated
  USING (requesting_user_id() = user_id);

-- Policy for subscriptions table - users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
  ON public.subscriptions 
  FOR SELECT TO authenticated
  USING (requesting_user_id() = user_id);

CREATE POLICY "Users can view job posts in their reports" 
  ON public.job_report_posts 
  FOR SELECT TO authenticated
  USING (
    job_report_id IN (
      SELECT id FROM public.job_reports WHERE user_id = requesting_user_id()
    )
  );

CREATE POLICY "Users can create job post associations for their reports" 
  ON public.job_report_posts 
  FOR INSERT TO authenticated
  WITH CHECK (
    job_report_id IN (
      SELECT id FROM public.job_reports WHERE user_id = requesting_user_id()
    )
  );

CREATE POLICY "Service role can manage all users" ON "public"."users" 
FOR ALL TO service_role 
USING (true);

CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (
    id,
    user_id,
    plan,
    credits,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    uuid_generate_v4(),
    NEW.id,
    'free',
    3,  -- Crediti iniziali per il piano gratuito
    true,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crea il trigger che si attiva dopo l'inserimento di un nuovo utente
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON public.users
FOR EACH ROW EXECUTE FUNCTION public.create_default_subscription();
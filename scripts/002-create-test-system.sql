-- Create test system tables without any restrictions or policies

-- 1. Roles (admin/user/reviewer)
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mapping of users to roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 3. Test templates (each version per language)
CREATE TABLE IF NOT EXISTS public.test_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL,
  version_code TEXT NOT NULL,
  test_type TEXT CHECK (test_type IN ('demo', 'practice', 'full')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 120,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(language, version_code, test_type)
);

-- 4. Questions (multi-section, supports MCQ/audio/etc.)
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT CHECK (section IN ('reading', 'writing', 'speaking', 'listening')) NOT NULL,
  subsection TEXT,
  prompt TEXT NOT NULL,
  options TEXT[],
  correct_answer TEXT,
  audio_url TEXT,
  image_url TEXT,
  language TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_auto_gradable BOOLEAN DEFAULT FALSE,
  max_score INTEGER DEFAULT 10,
  time_limit_seconds INTEGER,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Mapping template to its questions
CREATE TABLE IF NOT EXISTS public.template_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_template_id uuid REFERENCES public.test_templates(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_template_id, question_id),
  UNIQUE(test_template_id, section, question_order)
);

-- 6. When a user buys or starts a test
CREATE TABLE IF NOT EXISTS public.user_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  test_template_id uuid REFERENCES public.test_templates(id),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'under_review', 'reviewed', 'cancelled')),
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  final_score INTEGER,
  max_possible_score INTEGER,
  pass_threshold INTEGER DEFAULT 60,
  is_passed BOOLEAN,
  reviewer_notes TEXT,
  certificate_url TEXT,
  current_section TEXT,
  current_question_index INTEGER DEFAULT 0,
  time_remaining_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Answers submitted by user
CREATE TABLE IF NOT EXISTS public.test_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_test_id uuid REFERENCES public.user_tests(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  answer_text TEXT,
  audio_url TEXT,
  file_url TEXT,
  is_correct BOOLEAN,
  auto_score INTEGER,
  time_spent_seconds INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_test_id, question_id)
);

-- 8. Admin reviews for subjective questions
CREATE TABLE IF NOT EXISTS public.admin_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_test_id uuid REFERENCES public.user_tests(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0),
  max_score INTEGER,
  feedback TEXT,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_test_id, question_id)
);

-- 9. Test sessions for tracking user progress
CREATE TABLE IF NOT EXISTS public.test_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_test_id uuid REFERENCES public.user_tests(id) ON DELETE CASCADE,
  session_data JSONB,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_test_templates_language ON public.test_templates(language);
CREATE INDEX IF NOT EXISTS idx_test_templates_type ON public.test_templates(test_type);
CREATE INDEX IF NOT EXISTS idx_test_templates_active ON public.test_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_section ON public.questions(section);
CREATE INDEX IF NOT EXISTS idx_questions_language ON public.questions(language);
CREATE INDEX IF NOT EXISTS idx_questions_auto_gradable ON public.questions(is_auto_gradable);
CREATE INDEX IF NOT EXISTS idx_template_questions_template_id ON public.template_questions(test_template_id);
CREATE INDEX IF NOT EXISTS idx_template_questions_section_order ON public.template_questions(test_template_id, section, question_order);
CREATE INDEX IF NOT EXISTS idx_user_tests_user_id ON public.user_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tests_status ON public.user_tests(status);
CREATE INDEX IF NOT EXISTS idx_user_tests_template_id ON public.user_tests(test_template_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_user_test_id ON public.test_answers(user_test_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_question_id ON public.test_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_admin_reviews_user_test_id ON public.admin_reviews(user_test_id);
CREATE INDEX IF NOT EXISTS idx_admin_reviews_reviewer_id ON public.admin_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_test_id ON public.test_sessions(user_test_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_last_activity ON public.test_sessions(last_activity);

-- Insert default roles
INSERT INTO public.roles (name) VALUES 
  ('user'),
  ('admin'),
  ('reviewer'),
  ('super_admin')
ON CONFLICT (name) DO NOTHING;

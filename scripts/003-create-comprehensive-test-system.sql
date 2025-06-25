-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS template_questions CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS test_templates CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'reviewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Test templates (each test version per language)
CREATE TABLE test_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL,
  version_code TEXT NOT NULL,
  test_type TEXT NOT NULL DEFAULT 'full_test' CHECK (test_type IN ('full_test', 'practice', 'demo')),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 20,
  price_cents INTEGER DEFAULT 4900, -- $49.00
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language, version_code)
);

-- 3. Questions bank
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('reading', 'writing', 'speaking', 'listening')),
  subsection TEXT, -- e.g., 'mcq', 'fill_blanks', 'essay', 'topic_discussion'
  prompt TEXT NOT NULL,
  options TEXT[], -- for MCQ questions
  correct_answer TEXT, -- for auto-gradable questions
  audio_url TEXT, -- for listening questions
  image_url TEXT, -- for visual questions
  language TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  max_score INTEGER DEFAULT 10,
  is_auto_gradable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Template questions mapping
CREATE TABLE template_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_template_id UUID NOT NULL REFERENCES test_templates(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_template_id, question_id),
  UNIQUE(test_template_id, section, question_order)
);

-- 5. User test instances
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_template_id UUID NOT NULL REFERENCES test_templates(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'under_review', 'reviewed', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  final_score INTEGER,
  max_possible_score INTEGER,
  percentage_score DECIMAL(5,2),
  pass_threshold INTEGER DEFAULT 60,
  is_passed BOOLEAN,
  reviewer_notes TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User answers
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  answer_text TEXT,
  audio_url TEXT, -- for speaking section recordings
  file_url TEXT, -- for any file uploads
  is_correct BOOLEAN, -- for auto-gradable questions
  auto_score INTEGER, -- automated scoring
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_id, question_id)
);

-- 7. Manual reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL,
  feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_id, question_id)
);

-- 8. Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  language TEXT NOT NULL,
  final_score INTEGER NOT NULL,
  percentage_score DECIMAL(5,2) NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE, -- optional expiry
  qr_code_url TEXT,
  pdf_url TEXT,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_test_templates_language ON test_templates(language);
CREATE INDEX idx_test_templates_active ON test_templates(is_active);
CREATE INDEX idx_questions_section ON questions(section);
CREATE INDEX idx_questions_language ON questions(language);
CREATE INDEX idx_template_questions_template ON template_questions(test_template_id);
CREATE INDEX idx_tests_user_id ON tests(user_id);
CREATE INDEX idx_tests_status ON tests(status);
CREATE INDEX idx_tests_language ON tests(language);
CREATE INDEX idx_answers_test_id ON answers(test_id);
CREATE INDEX idx_reviews_test_id ON reviews(test_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: users can view/update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Test templates: public read for active templates
CREATE POLICY "Anyone can view active test templates" ON test_templates
  FOR SELECT USING (is_active = true);

-- Questions: admins can manage, users can view during tests
CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
    )
  );

-- Tests: users can view/manage their own tests
CREATE POLICY "Users can view own tests" ON tests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own tests" ON tests
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- **FIX STARTS HERE**
-- Drop existing insert policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own tests" ON tests;
DROP POLICY IF EXISTS "Allow creation of specific demo tests" ON tests;

-- Policy for authenticated users to create their own (non-demo) tests
CREATE POLICY "Users can create their own tests"
  ON tests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy to allow creation of demo tests.
-- This is permissive and allows any request to create a demo test for the specific demo user.
-- This is what your API route needs to succeed.
CREATE POLICY "Allow creation of specific demo tests"
  ON tests
  FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000');
-- **FIX ENDS HERE**


-- Answers: users can manage their own answers
CREATE POLICY "Users can manage own answers" ON answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tests 
      WHERE tests.id = answers.test_id AND tests.user_id = auth.uid()
    )
  );

-- Reviews: reviewers can manage reviews
CREATE POLICY "Reviewers can manage reviews" ON reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
    )
  );

-- Certificates: users can view their own certificates
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (user_id = auth.uid());

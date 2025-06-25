-- Function to randomly assign a test template to a user
CREATE OR REPLACE FUNCTION assign_random_test_template(
  p_user_id UUID,
  p_language TEXT
) RETURNS UUID AS $$
DECLARE
  v_template_id UUID;
BEGIN
  -- Get a random active test template for the language
  SELECT id INTO v_template_id
  FROM test_templates
  WHERE language = p_language 
    AND test_type = 'full_test'
    AND is_active = true
  ORDER BY RANDOM()
  LIMIT 1;
  
  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'No active test templates found for language: %', p_language;
  END IF;
  
  -- Create a new test instance
  INSERT INTO tests (user_id, test_template_id, language, status)
  VALUES (p_user_id, v_template_id, p_language, 'not_started');
  
  RETURN v_template_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate test scores
CREATE OR REPLACE FUNCTION calculate_test_score(p_test_id UUID) RETURNS VOID AS $$
DECLARE
  v_total_score INTEGER := 0;
  v_max_score INTEGER := 0;
  v_percentage DECIMAL(5,2);
  v_pass_threshold INTEGER;
BEGIN
  -- Calculate auto-graded scores
  UPDATE answers 
  SET 
    is_correct = (answer_text = q.correct_answer),
    auto_score = CASE 
      WHEN answer_text = q.correct_answer THEN q.max_score 
      ELSE 0 
    END
  FROM questions q
  WHERE answers.question_id = q.id 
    AND answers.test_id = p_test_id
    AND q.is_auto_gradable = true;
  
  -- Calculate total score (auto + manual reviews)
  SELECT 
    COALESCE(SUM(COALESCE(a.auto_score, 0)), 0) + COALESCE(SUM(COALESCE(r.score, 0)), 0),
    SUM(q.max_score)
  INTO v_total_score, v_max_score
  FROM answers a
  JOIN questions q ON q.id = a.question_id
  LEFT JOIN reviews r ON r.test_id = a.test_id AND r.question_id = a.question_id
  WHERE a.test_id = p_test_id;
  
  -- Calculate percentage
  v_percentage := CASE 
    WHEN v_max_score > 0 THEN (v_total_score::DECIMAL / v_max_score::DECIMAL) * 100
    ELSE 0
  END;
  
  -- Get pass threshold
  SELECT pass_threshold INTO v_pass_threshold FROM tests WHERE id = p_test_id;
  
  -- Update test with final scores
  UPDATE tests 
  SET 
    final_score = v_total_score,
    max_possible_score = v_max_score,
    percentage_score = v_percentage,
    is_passed = (v_percentage >= v_pass_threshold),
    status = CASE 
      WHEN status = 'under_review' AND v_percentage >= v_pass_threshold THEN 'completed'
      WHEN status = 'under_review' THEN 'reviewed'
      ELSE status
    END,
    completed_at = CASE 
      WHEN v_percentage >= v_pass_threshold THEN NOW()
      ELSE completed_at
    END
  WHERE id = p_test_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate certificate
CREATE OR REPLACE FUNCTION generate_certificate(p_test_id UUID) RETURNS UUID AS $$
DECLARE
  v_certificate_id UUID;
  v_user_id UUID;
  v_language TEXT;
  v_final_score INTEGER;
  v_percentage DECIMAL(5,2);
  v_certificate_number TEXT;
BEGIN
  -- Get test details
  SELECT user_id, language, final_score, percentage_score
  INTO v_user_id, v_language, v_final_score, v_percentage
  FROM tests
  WHERE id = p_test_id AND is_passed = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Test not found or not passed';
  END IF;
  
  -- Generate unique certificate number
  v_certificate_number := 'CERT-' || UPPER(v_language) || '-' || 
                          TO_CHAR(NOW(), 'YYYY') || '-' || 
                          LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' ||
                          LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
  
  -- Create certificate
  INSERT INTO certificates (
    test_id, user_id, certificate_number, language, 
    final_score, percentage_score, issue_date
  ) VALUES (
    p_test_id, v_user_id, v_certificate_number, v_language,
    v_final_score, v_percentage, CURRENT_DATE
  ) RETURNING id INTO v_certificate_id;
  
  -- Update test
  UPDATE tests 
  SET certificate_issued = true
  WHERE id = p_test_id;
  
  RETURN v_certificate_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate scores when reviews are added
CREATE OR REPLACE FUNCTION trigger_calculate_score() RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_test_score(NEW.test_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_score();

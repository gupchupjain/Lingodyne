-- Insert sample test templates
INSERT INTO test_templates (language, version_code, test_type, title, description, duration_minutes, price_cents) VALUES
('English', 'A', 'full_test', 'English Proficiency Test - Version A', 'Comprehensive English assessment covering all four skills', 20, 4900),
('English', 'B', 'full_test', 'English Proficiency Test - Version B', 'Comprehensive English assessment covering all four skills', 20, 4900),
('English', 'C', 'full_test', 'English Proficiency Test - Version C', 'Comprehensive English assessment covering all four skills', 20, 4900),
('German', 'A', 'full_test', 'German Proficiency Test - Version A', 'Comprehensive German assessment covering all four skills', 20, 4900),
('Spanish', 'A', 'full_test', 'Spanish Proficiency Test - Version A', 'Comprehensive Spanish assessment covering all four skills', 20, 4900),
('English', 'DEMO', 'demo', 'English Demo Test', 'Free demo test to experience our platform', 5, 0),
('English', 'PRACTICE', 'practice', 'English Practice Test', 'Practice test for preparation', 15, 1900);

-- Insert sample questions for English Test A
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score) VALUES
-- Reading Section
('reading', 'mcq', 'What is the main idea of the passage about climate change?', ARRAY['Global warming is not real', 'Climate change affects weather patterns', 'Only polar bears are affected', 'Nothing can be done'], 'Climate change affects weather patterns', 'English', true, 10),
('reading', 'mcq', 'According to the text, which renewable energy source is most efficient?', ARRAY['Solar power', 'Wind power', 'Hydroelectric power', 'Geothermal energy'], 'Wind power', 'English', true, 10),
('reading', 'fill_blanks', 'The company has been _____ profits for three consecutive years.', ARRAY['making', 'taking', 'doing', 'having'], 'making', 'English', true, 10),

-- Writing Section
('writing', 'essay', 'Write a 150-word essay about the importance of education in modern society. Include specific examples and personal experiences.', NULL, NULL, 'English', false, 25),
('writing', 'formal_letter', 'Write a formal letter to your local government requesting better public transportation in your area.', NULL, NULL, 'English', false, 25),

-- Speaking Section
('speaking', 'topic_discussion', 'Describe your favorite holiday destination and explain why you would recommend it to others. You have 2 minutes to speak.', NULL, NULL, 'English', false, 25),
('speaking', 'opinion', 'Do you think social media has a positive or negative impact on society? Explain your opinion with examples.', NULL, NULL, 'English', false, 25),

-- Listening Section
('listening', 'mcq', 'What time does the train to London depart?', ARRAY['9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM'], '9:30 AM', 'English', true, 10),
('listening', 'fill_blanks', 'The speaker mentioned that the meeting will be held in the _____ room.', ARRAY['conference', 'board', 'meeting', 'main'], 'conference', 'English', true, 10);

-- Map questions to English Test A template
INSERT INTO template_questions (test_template_id, question_id, section, question_order)
SELECT 
  tt.id,
  q.id,
  q.section,
  ROW_NUMBER() OVER (PARTITION BY q.section ORDER BY q.created_at)
FROM test_templates tt
CROSS JOIN questions q
WHERE tt.language = 'English' AND tt.version_code = 'A' AND q.language = 'English';

-- Insert sample questions for English Test B (different questions)
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score) VALUES
-- Reading Section for Test B
('reading', 'mcq', 'What does the author suggest about remote work?', ARRAY['It reduces productivity', 'It improves work-life balance', 'It is only suitable for tech jobs', 'It will replace all office work'], 'It improves work-life balance', 'English', true, 10),
('reading', 'comprehension', 'Based on the passage, what are the three main benefits of exercise mentioned?', NULL, 'Physical health, mental wellbeing, social interaction', 'English', false, 15),

-- Writing Section for Test B
('writing', 'essay', 'Discuss the advantages and disadvantages of online learning. Provide examples from your own experience.', NULL, NULL, 'English', false, 25),

-- Speaking Section for Test B
('speaking', 'description', 'Describe a memorable event from your childhood and explain why it was significant to you.', NULL, NULL, 'English', false, 25),

-- Listening Section for Test B
('listening', 'mcq', 'What is the main topic of the conversation?', ARRAY['Planning a vacation', 'Discussing work schedules', 'Talking about hobbies', 'Arranging a meeting'], 'Planning a vacation', 'English', true, 10);

-- Map questions to English Test B template
INSERT INTO template_questions (test_template_id, question_id, section, question_order)
SELECT 
  tt.id,
  q.id,
  q.section,
  ROW_NUMBER() OVER (PARTITION BY q.section ORDER BY q.created_at)
FROM test_templates tt
CROSS JOIN questions q
WHERE tt.language = 'English' AND tt.version_code = 'B' AND q.language = 'English'
AND q.id NOT IN (
  SELECT tq.question_id 
  FROM template_questions tq 
  JOIN test_templates tt2 ON tt2.id = tq.test_template_id 
  WHERE tt2.version_code = 'A'
);

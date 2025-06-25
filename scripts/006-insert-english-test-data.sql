-- Clear existing English test data
DELETE FROM template_questions WHERE test_template_id IN (
  SELECT id FROM test_templates WHERE language = 'English'
);
DELETE FROM questions WHERE language = 'English';
DELETE FROM test_templates WHERE language = 'English';

-- Insert English test templates
INSERT INTO test_templates (language, version_code, test_type, title, description, duration_minutes, price_cents) VALUES
('English', 'A', 'full_test', 'English Proficiency Test - Version A', 'Comprehensive English assessment covering all four skills', 60, 4900),
('English', 'B', 'full_test', 'English Proficiency Test - Version B', 'Comprehensive English assessment covering all four skills', 60, 4900),
('English', 'DEMO', 'demo', 'English Demo Test', 'Free demo test to experience our platform', 15, 0),
('English', 'PRACTICE', 'practice', 'English Practice Test', 'Practice test for preparation', 30, 1900);

-- ===========================================
-- ENGLISH TEST A - MEDIUM DIFFICULTY
-- ===========================================

-- Reading Section - Test A (8 questions: MCQ, Fill-blanks, Correct word MCQ)
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES

-- MCQ Questions (3 questions)
('reading', 'mcq', 'According to the passage about renewable energy, what is the primary advantage of solar power over fossil fuels?', 
 ARRAY['Lower installation costs', 'Unlimited availability during daylight', 'No environmental impact', 'Easier maintenance'], 
 'Unlimited availability during daylight', 'English', true, 10, 3),

('reading', 'mcq', 'The author''s main argument in the text about urban planning suggests that:', 
 ARRAY['Cities should prioritize car transportation', 'Green spaces are essential for mental health', 'Population density should be reduced', 'Commercial areas need expansion'], 
 'Green spaces are essential for mental health', 'English', true, 10, 3),

('reading', 'mcq', 'Based on the economic analysis presented, which factor most significantly impacts inflation rates?', 
 ARRAY['Government spending', 'Consumer demand fluctuations', 'International trade policies', 'Employment rates'], 
 'Consumer demand fluctuations', 'English', true, 10, 3),

-- Fill-blanks Questions (3 questions)
('reading', 'fill_blanks', 'The company''s innovative approach has _____ significant improvements in productivity and employee satisfaction.', 
 ARRAY['yielded', 'produced', 'generated', 'created'], 
 'yielded', 'English', true, 10, 3),

('reading', 'fill_blanks', 'Despite the economic downturn, the organization managed to _____ its market position through strategic investments.', 
 ARRAY['maintain', 'sustain', 'preserve', 'retain'], 
 'maintain', 'English', true, 10, 3),

('reading', 'fill_blanks', 'The research findings _____ that climate change will have profound effects on agricultural productivity.', 
 ARRAY['indicate', 'suggest', 'demonstrate', 'reveal'], 
 'indicate', 'English', true, 10, 3),

-- Correct word MCQ (2 questions)
('reading', 'correct_word', 'Choose the correct word: The new policy will have a significant _____ on international trade relations.', 
 ARRAY['affect', 'effect', 'effort', 'efficient'], 
 'effect', 'English', true, 10, 3),

('reading', 'correct_word', 'Select the appropriate word: The committee decided to _____ the proposal until further analysis could be completed.', 
 ARRAY['defer', 'differ', 'defect', 'defend'], 
 'defer', 'English', true, 10, 3);

-- Writing Section - Test A
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('writing', 'essay', 'Write a 250-word argumentative essay discussing whether remote work should become the standard for most office jobs. Support your position with specific examples and consider potential counterarguments.', 
 'English', false, 25, 3);

-- Speaking Section - Test A
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('speaking', 'topic_discussion', 'Describe a significant technological advancement that has changed society in the past decade. Explain its impact on daily life and discuss both positive and negative consequences. You have 3 minutes to speak.', 
 'English', false, 25, 3);

-- Listening Section - Test A
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES
('listening', 'mcq', 'In the business meeting recording, what was the main reason for the project delay?', 
 ARRAY['Budget constraints', 'Staff shortage', 'Technical difficulties', 'Client requirements change'], 
 'Technical difficulties', 'English', true, 10, 3);

-- ===========================================
-- ENGLISH TEST B - MEDIUM DIFFICULTY
-- ===========================================

-- Reading Section - Test B (8 questions)
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES

-- MCQ Questions (3 questions)
('reading', 'mcq', 'The passage about artificial intelligence suggests that the most significant concern is:', 
 ARRAY['Job displacement in manufacturing', 'Privacy and data security issues', 'High implementation costs', 'Technical complexity'], 
 'Privacy and data security issues', 'English', true, 10, 3),

('reading', 'mcq', 'According to the environmental study, which human activity contributes most to ocean pollution?', 
 ARRAY['Industrial waste disposal', 'Plastic consumption', 'Oil transportation', 'Agricultural runoff'], 
 'Plastic consumption', 'English', true, 10, 3),

('reading', 'mcq', 'The author''s perspective on globalization emphasizes that:', 
 ARRAY['Economic benefits outweigh cultural losses', 'Local traditions must be preserved', 'Technology facilitates cultural exchange', 'Governments should limit international trade'], 
 'Technology facilitates cultural exchange', 'English', true, 10, 3),

-- Fill-blanks Questions (3 questions)
('reading', 'fill_blanks', 'The pharmaceutical company''s breakthrough research has _____ new possibilities for treating rare diseases.', 
 ARRAY['unveiled', 'revealed', 'discovered', 'exposed'], 
 'unveiled', 'English', true, 10, 3),

('reading', 'fill_blanks', 'Educational institutions must _____ to changing technological demands to prepare students for future careers.', 
 ARRAY['adapt', 'adjust', 'conform', 'modify'], 
 'adapt', 'English', true, 10, 3),

('reading', 'fill_blanks', 'The archaeological findings _____ that ancient civilizations were more advanced than previously thought.', 
 ARRAY['imply', 'suggest', 'propose', 'recommend'], 
 'suggest', 'English', true, 10, 3),

-- Correct word MCQ (2 questions)
('reading', 'correct_word', 'Choose the correct word: The manager''s decision will _____ the entire department''s workflow.', 
 ARRAY['affect', 'effect', 'infect', 'perfect'], 
 'affect', 'English', true, 10, 3),

('reading', 'correct_word', 'Select the appropriate word: The team needs to _____ a comprehensive strategy for market expansion.', 
 ARRAY['devise', 'device', 'divide', 'derive'], 
 'devise', 'English', true, 10, 3);

-- Writing Section - Test B
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('writing', 'essay', 'Write a 250-word essay analyzing the role of social media in modern communication. Discuss how it has changed interpersonal relationships and evaluate whether these changes are predominantly positive or negative.', 
 'English', false, 25, 3);

-- Speaking Section - Test B
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('speaking', 'topic_discussion', 'Discuss the importance of environmental conservation in your community. Describe specific actions individuals can take and explain how these efforts contribute to global sustainability. You have 3 minutes to speak.', 
 'English', false, 25, 3);

-- Listening Section - Test B
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES
('listening', 'mcq', 'In the university lecture recording, what does the professor identify as the primary cause of urban heat islands?', 
 ARRAY['Vehicle emissions', 'Concrete and asphalt surfaces', 'Industrial activities', 'Population density'], 
 'Concrete and asphalt surfaces', 'English', true, 10, 3);

-- ===========================================
-- ENGLISH DEMO TEST - EASY DIFFICULTY
-- ===========================================

-- Reading Section - Demo (8 questions)
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES

-- MCQ Questions (3 questions)
('reading', 'mcq', 'What is the main topic of the passage about healthy eating?', 
 ARRAY['Exercise routines', 'Balanced nutrition', 'Weight loss tips', 'Cooking methods'], 
 'Balanced nutrition', 'English', true, 10, 1),

('reading', 'mcq', 'According to the text, what time does the library close on weekends?', 
 ARRAY['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'], 
 '6:00 PM', 'English', true, 10, 1),

('reading', 'mcq', 'The weather report mentions that tomorrow will be:', 
 ARRAY['Rainy and cold', 'Sunny and warm', 'Cloudy and cool', 'Windy and hot'], 
 'Sunny and warm', 'English', true, 10, 1),

-- Fill-blanks Questions (3 questions)
('reading', 'fill_blanks', 'I _____ to the store every morning to buy fresh bread.', 
 ARRAY['go', 'goes', 'going', 'gone'], 
 'go', 'English', true, 10, 1),

('reading', 'fill_blanks', 'She _____ her homework before watching television.', 
 ARRAY['finish', 'finishes', 'finished', 'finishing'], 
 'finishes', 'English', true, 10, 1),

('reading', 'fill_blanks', 'The cat is _____ under the table.', 
 ARRAY['sleep', 'sleeps', 'sleeping', 'slept'], 
 'sleeping', 'English', true, 10, 1),

-- Correct word MCQ (2 questions)
('reading', 'correct_word', 'Choose the correct word: I have _____ books than my sister.', 
 ARRAY['more', 'most', 'much', 'many'], 
 'more', 'English', true, 10, 1),

('reading', 'correct_word', 'Select the right word: The movie was very _____.', 
 ARRAY['interested', 'interesting', 'interest', 'interests'], 
 'interesting', 'English', true, 10, 1);

-- Writing Section - Demo
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('writing', 'essay', 'Write a short paragraph (100 words) about your favorite hobby. Explain what you like about it and how often you do it.', 
 'English', false, 15, 1);

-- Speaking Section - Demo
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('speaking', 'topic_discussion', 'Tell me about your family. Describe the people in your family and what you like to do together. You have 2 minutes to speak.', 
 'English', false, 15, 1);

-- Listening Section - Demo
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES
('listening', 'mcq', 'What does the woman want to buy at the store?', 
 ARRAY['Milk and bread', 'Eggs and butter', 'Apples and oranges', 'Rice and pasta'], 
 'Milk and bread', 'English', true, 10, 1);

-- ===========================================
-- ENGLISH PRACTICE TEST - EASY DIFFICULTY
-- ===========================================

-- Reading Section - Practice (8 questions)
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES

-- MCQ Questions (3 questions)
('reading', 'mcq', 'What does the advertisement say about the new restaurant?', 
 ARRAY['It serves Italian food', 'It opens at 6 AM', 'It offers free delivery', 'It has outdoor seating'], 
 'It offers free delivery', 'English', true, 10, 1),

('reading', 'mcq', 'According to the email, when is the meeting scheduled?', 
 ARRAY['Monday at 2 PM', 'Tuesday at 3 PM', 'Wednesday at 1 PM', 'Thursday at 4 PM'], 
 'Tuesday at 3 PM', 'English', true, 10, 1),

('reading', 'mcq', 'The article about pets suggests that dogs need:', 
 ARRAY['Daily exercise', 'Special food only', 'Indoor living', 'Constant attention'], 
 'Daily exercise', 'English', true, 10, 1),

-- Fill-blanks Questions (3 questions)
('reading', 'fill_blanks', 'My brother _____ football every weekend.', 
 ARRAY['play', 'plays', 'playing', 'played'], 
 'plays', 'English', true, 10, 1),

('reading', 'fill_blanks', 'We _____ to the beach last summer.', 
 ARRAY['go', 'goes', 'went', 'going'], 
 'went', 'English', true, 10, 1),

('reading', 'fill_blanks', 'The children are _____ in the park.', 
 ARRAY['run', 'runs', 'running', 'ran'], 
 'running', 'English', true, 10, 1),

-- Correct word MCQ (2 questions)
('reading', 'correct_word', 'Choose the correct word: This is _____ car in the parking lot.', 
 ARRAY['my', 'mine', 'me', 'I'], 
 'my', 'English', true, 10, 1),

('reading', 'correct_word', 'Select the right word: She speaks English very _____.', 
 ARRAY['good', 'well', 'better', 'best'], 
 'well', 'English', true, 10, 1);

-- Writing Section - Practice
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('writing', 'essay', 'Write a simple email (100 words) to a friend inviting them to your birthday party. Include the date, time, and location.', 
 'English', false, 15, 1);

-- Speaking Section - Practice
INSERT INTO questions (section, subsection, prompt, language, is_auto_gradable, max_score, difficulty_level) VALUES
('speaking', 'topic_discussion', 'Describe your daily routine. Talk about what you do in the morning, afternoon, and evening. You have 2 minutes to speak.', 
 'English', false, 15, 1);

-- Listening Section - Practice
INSERT INTO questions (section, subsection, prompt, options, correct_answer, language, is_auto_gradable, max_score, difficulty_level) VALUES
('listening', 'mcq', 'What time does the bus arrive according to the announcement?', 
 ARRAY['8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM'], 
 '8:30 AM', 'English', true, 10, 1);

-- ===========================================
-- MAP QUESTIONS TO TEST TEMPLATES
-- ===========================================

-- Map questions to English Test A
INSERT INTO template_questions (test_template_id, question_id, section, question_order)
SELECT 
  tt.id,
  q.id,
  q.section,
  ROW_NUMBER() OVER (PARTITION BY q.section ORDER BY q.created_at)
FROM test_templates tt
CROSS JOIN questions q
WHERE tt.language = 'English' 
  AND tt.version_code = 'A' 
  AND q.language = 'English'
  AND q.difficulty_level = 3;

-- Map questions to English Test B  
INSERT INTO template_questions (test_template_id, question_id, section, question_order)
SELECT 
  tt.id,
  q.id,
  q.section,
  ROW_NUMBER() OVER (PARTITION BY q.section ORDER BY q.created_at)
FROM test_templates tt
CROSS JOIN questions q
WHERE tt.language = 'English' 
  AND tt.version_code = 'B' 
  AND q.language = 'English'
  AND q.difficulty_level = 3
  AND q.id NOT IN (
    SELECT tq.question_id 
    FROM template_questions tq 
    JOIN test_templates tt2 ON tt2.id = tq.test_template_id 
    WHERE tt2.version_code = 'A' AND tt2.language = 'English'
  );

-- Map questions to Demo Test
INSERT INTO template_questions (test_template_id, question_id, section, question_order)
SELECT 
  tt.id,
  q.id,
  q.section,
  ROW_NUMBER() OVER (PARTITION BY q.section ORDER BY q.created_at)
FROM test_templates tt
CROSS JOIN questions q
WHERE tt.language = 'English' 
  AND tt.version_code = 'DEMO' 
  AND q.language = 'English'
  AND q.difficulty_level = 1
  AND q.subsection != 'essay' OR (q.subsection = 'essay' AND q.max_score = 15);

-- Map questions to Practice Test
INSERT INTO template_questions (test_template_id, question_id, section, question_order)
SELECT 
  tt.id,
  q.id,
  q.section,
  ROW_NUMBER() OVER (PARTITION BY q.section ORDER BY q.created_at)
FROM test_templates tt
CROSS JOIN questions q
WHERE tt.language = 'English' 
  AND tt.version_code = 'PRACTICE' 
  AND q.language = 'English'
  AND q.difficulty_level = 1
  AND q.id NOT IN (
    SELECT tq.question_id 
    FROM template_questions tq 
    JOIN test_templates tt2 ON tt2.id = tq.test_template_id 
    WHERE tt2.version_code = 'DEMO' AND tt2.language = 'English'
  );

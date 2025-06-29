-- Test script to verify reviewer access and test data
-- Run this to check if everything is set up correctly

-- 1. Check if reviewer role exists
SELECT 'Checking reviewer role...' as step;
SELECT id, name FROM roles WHERE name = 'reviewer';

-- 2. Check user roles for a specific user (replace with actual email)
SELECT 'Checking user roles...' as step;
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'gupchupjain@gmail.com';

-- 3. Check tests that need review
SELECT 'Checking tests for review...' as step;
SELECT 
    ut.id,
    ut.status,
    ut.submitted_at,
    u.email as user_email,
    tt.title as test_title,
    tt.language
FROM user_tests ut
JOIN users u ON ut.user_id = u.id
JOIN test_templates tt ON ut.test_template_id = tt.id
WHERE ut.status IN ('submitted', 'under_review')
ORDER BY ut.submitted_at DESC;

-- 4. Count tests by status
SELECT 'Test status breakdown...' as step;
SELECT 
    status,
    COUNT(*) as count
FROM user_tests
GROUP BY status
ORDER BY status;

-- 5. Check if there are any tests with answers
SELECT 'Checking test answers...' as step;
SELECT 
    COUNT(*) as total_answers,
    COUNT(DISTINCT user_test_id) as tests_with_answers
FROM test_answers;

-- 6. Check admin_reviews table
SELECT 'Checking admin reviews...' as step;
SELECT 
    COUNT(*) as total_reviews,
    COUNT(DISTINCT user_test_id) as tests_reviewed
FROM admin_reviews; 
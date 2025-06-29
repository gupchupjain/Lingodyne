-- Script to add reviewer role to a user
-- Replace 'user-email@example.com' with the actual user email

-- First, get the user ID
DO $$
DECLARE
    user_id uuid;
    reviewer_role_id uuid;
BEGIN
    -- Get user ID by email
    SELECT id INTO user_id 
    FROM users 
    WHERE email = 'gupchupjain@gmail.com';
    
    -- Get reviewer role ID
    SELECT id INTO reviewer_role_id 
    FROM roles 
    WHERE name = 'reviewer';
    
    -- Add reviewer role to user if not already assigned
    IF user_id IS NOT NULL AND reviewer_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (user_id, reviewer_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        RAISE NOTICE 'Reviewer role added to user: %', user_id;
    ELSE
        RAISE NOTICE 'User or reviewer role not found';
    END IF;
END $$; 
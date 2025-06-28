# Environment Setup Guide

## Required Environment Variables

To fix the login issue, you need to create a `.env.local` file in your project root with the following variables:

### 1. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Email Service (Resend)
```
RESEND_API_KEY=your_resend_api_key_here
```

### 3. JWT Secret
```
JWT_SECRET=your_jwt_secret_here
```

## How to Get These Values

### Supabase Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy the "Project URL" and "anon public" key
5. For service role key, copy the "service_role" key (keep this secret!)

### Resend Setup:
1. Go to [resend.com](https://resend.com)
2. Create an account and get your API key

### JWT Secret:
Generate a secure random string (you can use an online generator or run `openssl rand -base64 32`)

## Steps to Fix:
1. Create `.env.local` file in project root
2. Add the above variables with your actual values
3. Restart the development server: `npm run dev`

## Example .env.local file:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_1234567890abcdef...
JWT_SECRET=your-super-secret-jwt-key-here
``` 
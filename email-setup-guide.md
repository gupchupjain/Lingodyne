# Email Setup Guide for Production

## Current Issue
Resend is in sandbox mode, which restricts sending emails to only verified addresses. You need to verify your domain to send emails to any recipient.

## Step-by-Step Solution

### 1. Verify Domain in Resend
1. Go to [resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter: `v0-corporate-language-test-site.vercel.app`
4. Follow the DNS verification steps
5. Wait for verification (usually 5-30 minutes)

### 2. Update Vercel Environment Variables
Once domain is verified, update these variables in Vercel:

```bash
# Required variables
CUSTOM_DOMAIN=v0-corporate-language-test-site.vercel.app
NEXT_PUBLIC_APP_URL=https://v0-corporate-language-test-site.vercel.app
RESEND_API_KEY=your_resend_api_key_here

# Optional for debugging
DEBUG_SECRET=your_debug_secret_here
```

### 3. Force Redeploy
After updating environment variables:
1. Go to Vercel dashboard
2. Find your project
3. Click "Redeploy" to apply new environment variables

### 4. Test Email Sending
Test the email functionality:

```bash
# Test signup with a real email
curl -X POST https://v0-corporate-language-test-site.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-real-email@gmail.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User",
    "dateOfBirth": "1990-01-01"
  }'
```

### 5. Alternative: Use Your Own Email for Testing
If you want to test immediately without domain verification:
- Use your own email address (the one you used to sign up for Resend)
- Resend allows sending to your own email even in sandbox mode

## Troubleshooting

### If Domain Verification Fails
1. Check DNS records are correct
2. Wait longer (up to 24 hours for DNS propagation)
3. Contact Resend support if issues persist

### If Emails Still Don't Send
1. Check Vercel logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure domain is fully verified in Resend

### Environment Variable Debug
Use this endpoint to check your environment variables:
```bash
curl -H "Authorization: Bearer your-debug-secret" \
  https://v0-corporate-language-test-site.vercel.app/api/debug/env
```

## Expected Behavior After Setup
- Emails will be sent from: `noreply@v0-corporate-language-test-site.vercel.app`
- All email recipients will receive verification emails
- No more sandbox mode restrictions 
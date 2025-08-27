# Email Setup Guide for Production

## Current Issue
Your Resend account is in **sandbox mode**, which means you can only send emails to the email address you used to sign up for Resend (`gupchupjain@gmail.com`).

## Solutions

### Option 1: Quick Fix - Use Resend's Production Domain
Update your `.env.local` file to use Resend's production domain:

```bash
# Add this to your .env.local
CUSTOM_DOMAIN=resend.dev
```

This will use `noreply@resend.dev` as the sender, which should work for production.

### Option 2: Verify Your Own Domain (Recommended for Production)

1. **Go to Resend Dashboard**
   - Visit [resend.com/domains](https://resend.com/domains)
   - Click "Add Domain"

2. **Add Your Domain**
   - Enter your domain (e.g., `yourcompany.com`)
   - Follow the DNS verification instructions

3. **Update Environment Variables**
   ```bash
   # Add to your .env.local
   CUSTOM_DOMAIN=yourcompany.com
   ```

4. **Update Sender Email**
   The code will automatically use `noreply@yourcompany.com` as the sender.

### Option 3: Test with Your Resend Account Email
For immediate testing, use `gupchupjain@gmail.com` as the recipient email.

## Testing Steps

### 1. Test with Resend's Production Domain
```bash
curl -X POST http://localhost:3000/api/debug/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-real-email@gmail.com","firstName":"Test"}'
```

### 2. Test with Your Resend Account Email
```bash
curl -X POST http://localhost:3000/api/debug/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"gupchupjain@gmail.com","firstName":"Test"}'
```

### 3. Test Signup Flow
- Go to your app's signup page
- Use a real email address
- Check if you receive the verification email

## Environment Variables Checklist

Make sure your `.env.local` has:

```bash
# Required
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional (for custom domain)
CUSTOM_DOMAIN=yourcompany.com
```

## Common Error Messages & Solutions

| Error Message | Solution |
|---------------|----------|
| "You can only send testing emails to your own email address" | Use Option 1 or 2 above |
| "Domain not verified" | Verify your domain at resend.com/domains |
| "Invalid `to` field" | Use a real email address, not example.com |

## Production Deployment

For production deployment, make sure to:

1. **Set environment variables** in your hosting platform
2. **Use a verified domain** (Option 2 above)
3. **Update NEXT_PUBLIC_APP_URL** to your production URL

## Quick Test Commands

```bash
# Test with production domain
curl -X POST http://localhost:3000/api/debug/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com","firstName":"Test"}'

# Test signup API
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"your-email@gmail.com","dateOfBirth":"1990-01-01","password":"password123"}'
```

## Support

If you're still having issues:
1. Check Resend dashboard for domain verification status
2. Verify your API key is correct
3. Check server logs for detailed error messages
4. Contact Resend support if needed 
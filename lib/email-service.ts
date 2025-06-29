import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const isDevelopment = process.env.NODE_ENV === 'development'

export async function sendVerificationEmail(email: string, otp: string, firstName: string) {
  try {
    // In development, log the email instead of sending if it's a test domain
    if (isDevelopment && (email.includes('example.com') || email.includes('test.com'))) {
      console.log('=== DEVELOPMENT EMAIL LOG ===')
      console.log('To:', email)
      console.log('Subject: Verify Your Email - EnglishPro Test')
      console.log('OTP Code:', otp)
      console.log('First Name:', firstName)
      console.log('=== END EMAIL LOG ===')
      
      return { success: true, data: { id: 'dev-email-logged' } }
    }

    const { data, error } = await resend.emails.send({
      from: "EnglishPro Test <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email - EnglishPro Test",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">EnglishPro Test</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Professional English Certification Platform</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
            <p>Thank you for signing up with EnglishPro Test. To complete your registration, please verify your email address using the code below:</p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="margin: 0; color: #667eea;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; margin: 15px 0;">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">This code expires in 5 minutes</p>
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                The EnglishPro Test Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      
      // Handle specific Resend errors
      if (error.message.includes('Invalid `to` field')) {
        return { 
          success: false, 
          error: "Email domain not allowed in development. Please use a real email address or check the console for the OTP code." 
        }
      }
      
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, firstName: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  try {
    // In development, log the email instead of sending if it's a test domain
    if (isDevelopment && (email.includes('example.com') || email.includes('test.com'))) {
      console.log('=== DEVELOPMENT EMAIL LOG ===')
      console.log('To:', email)
      console.log('Subject: Reset Your Password - EnglishPro Test')
      console.log('Reset URL:', resetUrl)
      console.log('First Name:', firstName)
      console.log('=== END EMAIL LOG ===')
      
      return { success: true, data: { id: 'dev-email-logged' } }
    }

    const { data, error } = await resend.emails.send({
      from: "EnglishPro Test <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - EnglishPro Test",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">EnglishPro Test</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Professional English Certification Platform</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            
            <p>This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                The EnglishPro Test Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      
      // Handle specific Resend errors
      if (error.message.includes('Invalid `to` field')) {
        return { 
          success: false, 
          error: "Email domain not allowed in development. Please use a real email address or check the console for the reset link." 
        }
      }
      
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

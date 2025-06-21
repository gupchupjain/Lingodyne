import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, otp: string, firstName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Lingodyne <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email - Lingodyne",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Lingodyne</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Professional Language Certification Platform</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
            <p>Thank you for signing up with Lingodyne. To complete your registration, please verify your email address using the code below:</p>
            
            <div style="background: white; border: 2px dashed #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="margin: 0; color: #16a34a;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; margin: 15px 0;">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">This code expires in 5 minutes</p>
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                The Lingodyne Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
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
    const { data, error } = await resend.emails.send({
      from: "Lingodyne <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Lingodyne",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Lingodyne</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Professional Language Certification Platform</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${firstName}!</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #16a34a; background: #f0f9ff; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
            
            <p>This link expires in 1 hour. If you didn't request a password reset, please ignore this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                The Lingodyne Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Email sending error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

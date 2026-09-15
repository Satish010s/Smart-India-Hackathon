import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : '';
const isRealResendKey = resendApiKey && resendApiKey.startsWith('re_') && !resendApiKey.includes('xxxx');
const resend = isRealResendKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Quantum Platform <onboarding@resend.dev>';

/**
 * Log styled fallback to console for development when Resend is unconfigured
 */
const logDevOtp = (type, email, otp, extra = '') => {
  console.log('\n======================================================');
  console.log(`📧 [EMAIL SERVICE - DEV PREVIEW] Type: ${type}`);
  console.log(`To: ${email}`);
  if (otp) console.log(`🔑 6-DIGIT OTP CODE: [ ${otp} ] (Valid for 10 minutes)`);
  if (extra) console.log(`ℹ️ Info: ${extra}`);
  console.log('======================================================\n');
};

/**
 * Send 6-digit email verification OTP
 */
export const sendVerificationOtpEmail = async (email, name, otp) => {
  const subject = `${otp} is your Quantum verification code`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 20px; font-weight: 600; color: #f8fafc; margin-top: 8px; }
          .text { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 16px 0; }
          .otp-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: 'JetBrains Mono', monospace, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #38bdf8; }
          .footer { font-size: 13px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">QubitMind &middot; Quantum</div>
            <div class="title">Verify Your Email Address</div>
          </div>
          <p class="text">Hello ${name || 'Learner'},</p>
          <p class="text">Thank you for joining the Quantum Computing Platform. Please enter the following 6-digit verification code to activate your account:</p>
          <div class="otp-card">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="text">This code will expire in <strong>10 minutes</strong>. If you did not sign up for an account, you can safely ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Quantum Learning Platform. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    logDevOtp('Email Verification', email, otp);
    return { success: true, simulated: true };
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error sending verification email via Resend:', error.message);
    // Fallback log in dev
    logDevOtp('Email Verification (Resend Error Fallback)', email, otp, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset OTP email
 */
export const sendPasswordResetOtpEmail = async (email, name, otp) => {
  const subject = `${otp} is your Quantum password reset code`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #f43f5e, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .title { font-size: 20px; font-weight: 600; color: #f8fafc; margin-top: 8px; }
          .text { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 16px 0; }
          .otp-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: 'JetBrains Mono', monospace, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #fb7185; }
          .warning { font-size: 13px; color: #fbbf24; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 12px; margin: 16px 0; }
          .footer { font-size: 13px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Quantum Security</div>
            <div class="title">Reset Your Password</div>
          </div>
          <p class="text">Hello ${name || 'User'},</p>
          <p class="text">We received a request to reset the password for your Quantum account. Use the 6-digit code below to proceed:</p>
          <div class="otp-card">
            <div class="otp-code">${otp}</div>
          </div>
          <div class="warning">
            ⚠️ <strong>Security Notice:</strong> Completing this password reset will automatically terminate and invalidate all other active sessions across your devices.
          </div>
          <p class="text">This code will expire in <strong>10 minutes</strong>. If you did not make this request, please change your password immediately.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Quantum Learning Platform. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    logDevOtp('Password Reset', email, otp);
    return { success: true, simulated: true };
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error sending reset email via Resend:', error.message);
    logDevOtp('Password Reset (Resend Error Fallback)', email, otp, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email to admin-created Instructor
 */
export const sendInstructorWelcomeEmail = async (email, name, temporaryPassword) => {
  const subject = 'Welcome to Quantum Platform - Instructor Account Provisioned';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
          .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .text { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 16px 0; }
          .credentials { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .cred-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-family: monospace; font-size: 14px; }
          .footer { font-size: 13px; color: #64748b; text-align: center; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Quantum Platform &middot; Instructor Portal</div>
          <h2>Welcome, Professor ${name}!</h2>
          <p class="text">An administrator has provisioned an Instructor account for you on the Quantum Platform.</p>
          <div class="credentials">
            <div class="cred-row"><span>Email:</span> <strong>${email}</strong></div>
            <div class="cred-row"><span>Temporary Password:</span> <strong>${temporaryPassword}</strong></div>
            <div class="cred-row"><span>Role:</span> <strong>Instructor</strong></div>
          </div>
          <p class="text">Please log in and update your password immediately through the account settings.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Quantum Learning Platform.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    logDevOtp('Instructor Provisioning', email, null, `Temporary password: ${temporaryPassword}`);
    return { success: true, simulated: true };
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Error sending instructor welcome email:', error.message);
    logDevOtp('Instructor Provisioning (Fallback)', email, null, `Temporary password: ${temporaryPassword}`);
    return { success: false, error: error.message };
  }
};

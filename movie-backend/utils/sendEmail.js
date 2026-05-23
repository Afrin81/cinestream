import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (name, email) => {
  try {
    await transporter.sendMail({
      from: `"CineStream 🎬" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to CineStream! 🎬",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: #f3f4f6; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #dc2626; padding: 40px 32px; text-align: center; }
            .header h1 { color: white; font-size: 28px; font-weight: 900; margin-bottom: 8px; }
            .header p { color: rgba(255,255,255,0.85); font-size: 15px; }
            .body { padding: 40px 32px; }
            .greeting { font-size: 22px; font-weight: 800; color: #111; margin-bottom: 16px; }
            .text { color: #6b7280; font-size: 15px; line-height: 1.7; margin-bottom: 24px; }
            .features { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
            .feature { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 14px; color: #374151; }
            .feature:last-child { margin-bottom: 0; }
            .btn { display: block; background: #dc2626; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; text-align: center; margin-bottom: 24px; }
            .footer { background: #f9fafb; padding: 24px 32px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 CineStream</h1>
              <p>Your ultimate movie streaming platform</p>
            </div>
            <div class="body">
              <p class="greeting">Welcome, ${name}! 🎉</p>
              <p class="text">
                We're thrilled to have you join CineStream! Your account has been successfully created and you're ready to start exploring thousands of amazing movies.
              </p>
              <div class="features">
                <div class="feature">✅ Browse hundreds of free movies</div>
                <div class="feature">✅ Add movies to your watchlist</div>
                <div class="feature">✅ Watch trailers anytime</div>
                <div class="feature">✅ Rate and review movies</div>
                <div class="feature">💎 Upgrade to Premium for exclusive content</div>
              </div>
              <a href="https://cinestream-sepia.vercel.app" class="btn">
                Start Watching Now 🎬
              </a>
              <p class="text" style="font-size: 13px;">
                If you have any questions, feel free to contact us at
                <a href="mailto:support@cinestream.com" style="color: #dc2626;">support@cinestream.com</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 CineStream. All rights reserved.</p>
              <p style="margin-top: 6px;">Dhaka, Bangladesh</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log("✅ Welcome email sent to:", email);
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};
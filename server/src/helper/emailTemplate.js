const path = require("path");

exports.ForgetPasswordMail = (email, name, resetLink) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Nehdo",

    attachments: [
      {
        filename: "nehdo-logo.png",
        path: path.join(process.cwd(), "src/uploads/logo/nehdo-logo.png"),
        cid: "nehdoLogo",
      },
    ],

    html: `
    <div style="margin:0;padding:40px 20px;background:#f4f7fb;font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:35px 20px;text-align:center;">

          <img
            src="cid:nehdoLogo"
            alt="Nehdo"
            style="width:180px;height:auto;display:block;margin:0 auto;"
          />

          <p style="margin-top:15px;color:#dbeafe;font-size:15px;">
            Secure Password Reset
          </p>

        </div>

        <!-- Body -->
        <div style="padding:45px 35px;text-align:center;">

          <h2 style="margin:0;color:#111827;font-size:28px;">
            Hello, ${name}
          </h2>

          <p style="margin-top:25px;color:#6b7280;font-size:16px;line-height:1.8;">
            We received a request to reset the password for your
            <strong>Nehdo</strong> account.
          </p>

          <p style="margin-top:15px;color:#6b7280;font-size:16px;line-height:1.8;">
            Click the button below to securely create a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              margin-top:35px;
              padding:16px 40px;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              border-radius:10px;
              font-size:16px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>

          <div
            style="
              margin-top:35px;
              background:#FEF3C7;
              color:#92400E;
              padding:15px;
              border-radius:10px;
              font-size:14px;
              font-weight:bold;
            "
          >
            ⏳ This password reset link will expire in 10 minutes.
          </div>

          <p
            style="
              margin-top:30px;
              color:#9CA3AF;
              font-size:14px;
              line-height:1.8;
            "
          >
            If you didn't request this password reset, you can safely ignore
            this email. Your account will remain secure.
          </p>

        </div>

        <!-- Footer -->
        <div
          style="
            background:#F8FAFC;
            border-top:1px solid #E5E7EB;
            padding:25px;
            text-align:center;
          "
        >

          <h3 style="margin:0;color:#111827;">
            Nehdo
          </h3>

          <p style="margin:10px 0 0;color:#6B7280;font-size:14px;">
            Connecting Buyers & Sellers with Trust.
          </p>

          <p style="margin-top:18px;color:#9CA3AF;font-size:13px;">
            © ${new Date().getFullYear()} Nehdo. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
    `,
  };
};
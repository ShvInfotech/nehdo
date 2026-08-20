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



exports.AccountBlockedMail = (email, name) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Nehdo Account Has Been Blocked",

    attachments: [
      {
        filename: "nehdo-logo.png",
        path: path.join(
          process.cwd(),
          "src/uploads/logo/nehdo-logo.png"
        ),
        cid: "nehdoLogo",
      },
    ],

    html: `
    <div style="margin:0;padding:40px 20px;background:#f4f7fb;font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7f1d1d,#dc2626);padding:35px 20px;text-align:center;">

          <img
            src="cid:nehdoLogo"
            alt="Nehdo"
            style="width:180px;height:auto;display:block;margin:0 auto;"
          />

          <p style="margin-top:15px;color:#fee2e2;font-size:15px;">
            Account Status Update
          </p>

        </div>

        <!-- Body -->
        <div style="padding:45px 35px;text-align:center;">

          <h2 style="margin:0;color:#111827;font-size:28px;">
            Hello, ${name}
          </h2>

          <div
            style="
              margin-top:25px;
              background:#FEF2F2;
              border:1px solid #FECACA;
              color:#B91C1C;
              padding:18px;
              border-radius:10px;
              font-size:16px;
              font-weight:bold;
            "
          >
            Your Nehdo account has been blocked.
          </div>

          <p style="margin-top:25px;color:#6b7280;font-size:16px;line-height:1.8;">
            Your account has been temporarily restricted by the Nehdo
            administration.
          </p>

          <p style="margin-top:15px;color:#6b7280;font-size:16px;line-height:1.8;">
            You will not be able to access your account or use Nehdo services
            while your account remains blocked.
          </p>

          <div
            style="
              margin-top:30px;
              background:#F8FAFC;
              border:1px solid #E5E7EB;
              padding:20px;
              border-radius:10px;
              text-align:left;
            "
          >
            <h3 style="margin:0 0 10px;color:#374151;font-size:16px;">
              What can you do?
            </h3>

            <p style="margin:0;color:#6B7280;font-size:14px;line-height:1.7;">
              If you believe your account was blocked by mistake, please
              contact our support team for further assistance.
            </p>
          </div>

          <p
            style="
              margin-top:30px;
              color:#9CA3AF;
              font-size:14px;
              line-height:1.8;
            "
          >
            We take the security and integrity of the Nehdo platform seriously.
            Thank you for your understanding.
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



exports.DynamicMail = ({
  email,
  name,
  subject,
  message,
}) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,

    attachments: [
      {
        filename: "nehdo-logo.png",
        path: path.join(
          process.cwd(),
          "src/uploads/logo/nehdo-logo.png"
        ),
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
            Account Notification
          </p>

        </div>

        <!-- Body -->
        <div style="padding:45px 35px;">

          <h2 style="margin:0;color:#111827;font-size:28px;text-align:center;">
            Hello, ${name}
          </h2>

          <div
            style="
              margin-top:30px;
              background:#F8FAFC;
              border:1px solid #E5E7EB;
              padding:25px;
              border-radius:12px;
              color:#374151;
              font-size:16px;
              line-height:1.8;
            "
          >
            ${message}
          </div>

          <p
            style="
              margin-top:30px;
              color:#9CA3AF;
              font-size:14px;
              line-height:1.8;
              text-align:center;
            "
          >
            If you have any questions, please contact the Nehdo support team.
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
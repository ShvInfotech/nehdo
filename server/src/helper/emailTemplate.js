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


exports.PasswordChangeMail = (email, name, password) => {

  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Password Changed Successfully | Nehdo`,

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
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Changed - Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; width: 100%; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif">

        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 100%; background: #f4f7fb; margin: 0; padding: 0"
        >
            <tr>
                <td align="center" style="padding: 30px 15px">

                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 100%;
                            background: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                        "
                    >

                        <!-- ================= HEADER ================= -->

                        <tr>
                            <td
                                align="center"
                                style="background: linear-gradient(135deg, #14532d, #16a34a); padding: 40px 20px"
                            >
                                <img
                                    src="cid:nehdoLogo"
                                    alt="Nehdo"
                                    width="180"
                                    style="width: 180px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 15px 0 0; color: #dcfce7; font-size: 15px; line-height: 1.5">
                                    Password Changed Successfully
                                </p>
                            </td>
                        </tr>

                        <!-- ================= BODY ================= -->

                        <tr>
                            <td style="padding: 45px 6%">

                                <h2
                                    style="
                                        margin: 0;
                                        text-align: center;
                                        color: #111827;
                                        font-size: 28px;
                                        line-height: 1.3;
                                    "
                                >
                                    Hello, ${name}
                                </h2>

                                <p
                                    style="
                                        margin: 18px 0 0;
                                        text-align: center;
                                        color: #6b7280;
                                        font-size: 16px;
                                        line-height: 1.7;
                                    "
                                >
                                    Your account password has been changed successfully.
                                </p>

                                <!-- ================= SUCCESS MESSAGE ================= -->

                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="margin-top: 30px"
                                >
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                background: #ecfdf5;
                                                border: 1px solid #a7f3d0;
                                                color: #047857;
                                                padding: 18px;
                                                border-radius: 10px;
                                                font-size: 16px;
                                                font-weight: bold;
                                            "
                                        >
                                            ✓ Your password has been changed
                                        </td>
                                    </tr>
                                </table>

                                <!-- ================= ACCOUNT DETAILS ================= -->

                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        margin-top: 30px;
                                        background: #f8fafc;
                                        border: 1px solid #e5e7eb;
                                        border-radius: 12px;
                                    "
                                >
                                    <tr>
                                        <td style="padding: 22px">

                                            <h3
                                                style="
                                                    margin: 0 0 18px;
                                                    color: #111827;
                                                    font-size: 18px;
                                                    border-bottom: 1px solid #e5e7eb;
                                                    padding-bottom: 12px;
                                                "
                                            >
                                                Account Details
                                            </h3>

                                            <table
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                border="0"
                                                style="font-size: 14px"
                                            >

                                                <!-- App Name -->

                                                <tr>
                                                    <td style="padding: 9px 0; color: #6b7280">
                                                        App Name
                                                    </td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            padding: 9px 0;
                                                            color: #111827;
                                                            font-weight: bold;
                                                        "
                                                    >
                                                        Nehdo
                                                    </td>
                                                </tr>

                                                <!-- Email -->

                                                <tr>
                                                    <td style="padding: 9px 0; color: #6b7280">
                                                        Email
                                                    </td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            padding: 9px 0;
                                                            color: #111827;
                                                            font-weight: bold;
                                                        "
                                                    >
                                                        ${email}
                                                    </td>
                                                </tr>

                                                <!-- Password -->

                                                <tr>
                                                    <td style="padding: 14px 0; color: #6b7280">
                                                        New Password
                                                    </td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            padding: 14px 0;
                                                            color: #166534;
                                                            font-size: 17px;
                                                            font-weight: bold;
                                                        "
                                                    >
                                                        ${password}
                                                    </td>
                                                </tr>

                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- ================= SECURITY INFORMATION ================= -->

                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="margin-top: 25px"
                                >
                                    <tr>
                                        <td
                                            style="
                                                background: #fff7ed;
                                                border: 1px solid #fed7aa;
                                                padding: 22px;
                                                border-radius: 10px;
                                            "
                                        >

                                            <h3
                                                style="
                                                    margin: 0 0 10px;
                                                    color: #9a3412;
                                                    font-size: 17px
                                                "
                                            >
                                                Security Information
                                            </h3>

                                            <p
                                                style="
                                                    margin: 0;
                                                    color: #6b7280;
                                                    font-size: 14px;
                                                    line-height: 1.7;
                                                "
                                            >
                                                Your password was changed by the administrator.
                                                Please keep your new password secure and do not share it
                                                with anyone.
                                            </p>

                                        </td>
                                    </tr>
                                </table>

                                <!-- ================= SUPPORT ================= -->

                                <p
                                    style="
                                        margin: 30px 0 0;
                                        text-align: center;
                                        color: #9ca3af;
                                        font-size: 14px;
                                        line-height: 1.8;
                                    "
                                >
                                    If you did not request this password change or believe this
                                    was done by mistake, please contact our support team.
                                </p>

                            </td>
                        </tr>

                        <!-- ================= FOOTER ================= -->

                        <tr>
                            <td
                                align="center"
                                style="
                                    background: #f8fafc;
                                    border-top: 1px solid #e5e7eb;
                                    padding: 28px 20px
                                "
                            >

                                <h3 style="margin: 0; color: #111827; font-size: 20px">
                                    Nehdo
                                </h3>

                                <p
                                    style="
                                        margin: 10px 0 0;
                                        color: #6b7280;
                                        font-size: 14px
                                    "
                                >
                                    Connecting Buyers & Sellers with Trust.
                                </p>

                                <p
                                    style="
                                        margin: 18px 0 0;
                                        color: #9ca3af;
                                        font-size: 13px
                                    "
                                >
                                    © ${new Date().getFullYear()} Nehdo. All Rights Reserved.
                                </p>

                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>

    </body>
</html>
`,
  };
};





exports.OrderConfirmationMail = (email,name,orderId,orderTotal,paymentMethod) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmed - #${orderId} | Nehdo`,

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
        <div style="background:linear-gradient(135deg,#14532d,#16a34a);padding:35px 20px;text-align:center;">

          <img
            src="cid:nehdoLogo"
            alt="Nehdo"
            style="width:180px;height:auto;display:block;margin:0 auto;"
          />

          <p style="margin-top:15px;color:#dcfce7;font-size:15px;">
            Order Confirmation
          </p>

        </div>

        <!-- Body -->
        <div style="padding:45px 35px;">

          <h2 style="margin:0;text-align:center;color:#111827;font-size:28px;">
            Thank You, ${name}!
          </h2>

          <p style="margin-top:18px;text-align:center;color:#6b7280;font-size:16px;line-height:1.7;">
            Your order has been successfully placed with Nehdo.
            We will notify you once your order is shipped.
          </p>

          <!-- Success Message -->
          <div
            style="
              margin-top:28px;
              background:#F0FDF4;
              border:1px solid #BBF7D0;
              color:#15803D;
              padding:18px;
              border-radius:10px;
              text-align:center;
              font-size:16px;
              font-weight:bold;
            "
          >
            ✓ Your order has been confirmed
          </div>

          <!-- Order Details -->
          <div
            style="
              margin-top:30px;
              background:#F8FAFC;
              border:1px solid #E5E7EB;
              padding:22px;
              border-radius:12px;
            "
          >

            <h3
              style="
                margin:0 0 18px;
                color:#111827;
                font-size:18px;
                border-bottom:1px solid #E5E7EB;
                padding-bottom:12px;
              "
            >
              Order Details
            </h3>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="font-size:14px;"
            >

              <tr>
                <td style="padding:8px 0;color:#6B7280;">
                  Order ID
                </td>

                <td
                  style="
                    padding:8px 0;
                    color:#111827;
                    font-weight:bold;
                    text-align:right;
                  "
                >
                  #${orderId}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;color:#6B7280;">
                  Payment Method
                </td>

                <td
                  style="
                    padding:8px 0;
                    color:#111827;
                    font-weight:bold;
                    text-align:right;
                    text-transform:uppercase;
                  "
                >
                  ${paymentMethod}
                </td>
              </tr>

              <tr>
                <td style="padding:12px 0;color:#6B7280;">
                  Order Total
                </td>

                <td
                  style="
                    padding:12px 0;
                    color:#15803D;
                    font-size:18px;
                    font-weight:bold;
                    text-align:right;
                  "
                >
                  ₹${orderTotal}
                </td>
              </tr>

            </table>

          </div>

          <!-- What's Next -->
          <div
            style="
              margin-top:25px;
              background:#EFF6FF;
              border:1px solid #BFDBFE;
              padding:20px;
              border-radius:10px;
            "
          >

            <h3
              style="
                margin:0 0 10px;
                color:#1E3A8A;
                font-size:16px;
              "
            >
              What's Next?
            </h3>

            <p
              style="
                margin:0;
                color:#4B5563;
                font-size:14px;
                line-height:1.7;
              "
            >
              We are preparing your order for shipment.
              Once your order is shipped, you will receive another
              notification with the tracking details.
            </p>

          </div>

          <p
            style="
              margin-top:30px;
              text-align:center;
              color:#9CA3AF;
              font-size:14px;
              line-height:1.8;
            "
          >
            Thank you for shopping with Nehdo.
            We truly appreciate your trust and support.
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

          <p
            style="
              margin:10px 0 0;
              color:#6B7280;
              font-size:14px;
            "
          >
            Connecting Buyers & Sellers with Trust.
          </p>

          <p
            style="
              margin-top:18px;
              color:#9CA3AF;
              font-size:13px;
            "
          >
            © ${new Date().getFullYear()} Nehdo. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>
    `,
  };
};

exports.OrderCancelledMail = (email,name,orderId,orderTotal,paymentMethod,cancellationReason) => {
  const isPaidPayment =paymentMethod?.toLowerCase() === "online"?"online":"cod"

  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Cancelled - #${orderId} | Nehdo`,

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
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Cancelled - Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; width: 100%; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif">
        <!-- Full Width Wrapper -->
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 100%; background: #f4f7fb; margin: 0; padding: 0"
        >
            <tr>
                <td align="center" style="padding: 30px 15px">
                    <!-- Main Container -->
                    <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 100%;
                            background: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                        "
                    >
                        <!-- ================= HEADER ================= -->

                        <tr>
                            <td
                                align="center"
                                style="background: linear-gradient(135deg, #7f1d1d, #dc2626); padding: 40px 20px"
                            >
                                <img
                                    src="cid:nehdoLogo"
                                    alt="Nehdo"
                                    width="180"
                                    style="width: 180px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 15px 0 0; color: #fee2e2; font-size: 15px; line-height: 1.5">
                                    Order Cancellation
                                </p>
                            </td>
                        </tr>

                        <!-- ================= BODY ================= -->

                        <tr>
                            <td style="padding: 45px 6%">
                                <!-- Greeting -->

                                <h2
                                    style="
                                        margin: 0;
                                        text-align: center;
                                        color: #111827;
                                        font-size: 28px;
                                        line-height: 1.3;
                                    "
                                >
                                    Hello, ${name}
                                </h2>

                                <p
                                    style="
                                        margin: 18px 0 0;
                                        text-align: center;
                                        color: #6b7280;
                                        font-size: 16px;
                                        line-height: 1.7;
                                    "
                                >
                                    Your order has been successfully cancelled.
                                </p>

                                <!-- Cancelled Message -->

                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px">
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                background: #fef2f2;
                                                border: 1px solid #fecaca;
                                                color: #b91c1c;
                                                padding: 18px;
                                                border-radius: 10px;
                                                font-size: 16px;
                                                font-weight: bold;
                                            "
                                        >
                                            ✕ Your order has been cancelled
                                        </td>
                                    </tr>
                                </table>

                                <!-- ================= ORDER DETAILS ================= -->

                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        margin-top: 30px;
                                        background: #f8fafc;
                                        border: 1px solid #e5e7eb;
                                        border-radius: 12px;
                                    "
                                >
                                    <tr>
                                        <td style="padding: 22px">
                                            <h3
                                                style="
                                                    margin: 0 0 18px;
                                                    color: #111827;
                                                    font-size: 18px;
                                                    border-bottom: 1px solid #e5e7eb;
                                                    padding-bottom: 12px;
                                                "
                                            >
                                                Order Details
                                            </h3>

                                            <table
                                                width="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                border="0"
                                                style="font-size: 14px"
                                            >
                                                <!-- Order ID -->

                                                <tr>
                                                    <td style="padding: 9px 0; color: #6b7280">Order ID</td>

                                                    <td
                                                        align="right"
                                                        style="padding: 9px 0; color: #111827; font-weight: bold"
                                                    >
                                                        #${orderId}
                                                    </td>
                                                </tr>

                                                <!-- Payment -->

                                                <tr>
                                                    <td style="padding: 9px 0; color: #6b7280">Payment Method</td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            padding: 9px 0;
                                                            color: #111827;
                                                            font-weight: bold;
                                                            text-transform: uppercase;
                                                        "
                                                    >
                                                        ${paymentMethod}
                                                    </td>
                                                </tr>

                                                <!-- Total -->

                                                <tr>
                                                    <td style="padding: 14px 0; color: #6b7280">Order Total</td>

                                                    <td
                                                        align="right"
                                                        style="
                                                            padding: 14px 0;
                                                            color: #b91c1c;
                                                            font-size: 19px;
                                                            font-weight: bold;
                                                        "
                                                    >
                                                        ₹${orderTotal}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- ================= REFUND ================= -->

                                ${ isPaidPayment == "online" ? `
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 25px">
                                    <tr>
                                        <td
                                            style="
                                                background: #ecfdf5;
                                                border: 1px solid #a7f3d0;
                                                padding: 22px;
                                                border-radius: 10px;
                                            "
                                        >
                                            <h3 style="margin: 0 0 10px; color: #047857; font-size: 17px">
                                                Refund Information
                                            </h3>

                                            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7">
                                                Since your payment was already completed, the refund will be processed
                                                to your original payment method.
                                            </p>

                                            <p
                                                style="
                                                    margin: 10px 0 0;
                                                    color: #6b7280;
                                                    font-size: 14px;
                                                    line-height: 1.7;
                                                "
                                            >
                                                The refunded amount may take some time to reflect in your account
                                                depending on your bank or payment provider.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` : `
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 25px">
                                    <tr>
                                        <td
                                            style="
                                                background: #f8fafc;
                                                border: 1px solid #e5e7eb;
                                                padding: 22px;
                                                border-radius: 10px;
                                            "
                                        >
                                            <h3 style="margin: 0 0 10px; color: #374151; font-size: 17px">
                                                Payment Information
                                            </h3>

                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.7">
                                                No refund is required because this order was not paid online.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` }

                                <!-- ================= CANCELLATION REASON ================= -->

                                ${ cancellationReason ? `
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 25px">
                                    <tr>
                                        <td
                                            style="
                                                background: #fff7ed;
                                                border: 1px solid #fed7aa;
                                                padding: 22px;
                                                border-radius: 10px;
                                            "
                                        >
                                            <h3 style="margin: 0 0 10px; color: #9a3412; font-size: 17px">
                                                Cancellation Reason
                                            </h3>

                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.7">
                                                ${cancellationReason}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` : "" }

                                <!-- ================= SUPPORT ================= -->

                                <p
                                    style="
                                        margin: 30px 0 0;
                                        text-align: center;
                                        color: #9ca3af;
                                        font-size: 14px;
                                        line-height: 1.8;
                                    "
                                >
                                    If you did not request this cancellation or believe this was cancelled by mistake,
                                    please contact our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- ================= FOOTER ================= -->

                        <tr>
                            <td
                                align="center"
                                style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 28px 20px"
                            >
                                <h3 style="margin: 0; color: #111827; font-size: 20px">Nehdo</h3>

                                <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px">
                                    Connecting Buyers & Sellers with Trust.
                                </p>

                                <p style="margin: 18px 0 0; color: #9ca3af; font-size: 13px">
                                    © ${new Date().getFullYear()} Nehdo. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
`,
  };
};







exports.DynamicMail = ({email,name,subject,message,}) => {
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
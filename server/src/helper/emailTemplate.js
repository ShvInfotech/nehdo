const logoUrl = "https://res.cloudinary.com/dblxejpyp/image/upload/v1788841967/nehdo-logo.png";


// ==========================================================
// FORGET PASSWORD MAIL
// ==========================================================

exports.ForgetPasswordMail = (email, name, resetLink) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Nehdo",
    html: `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password - Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; background: #f3f5f8; font-family: Arial, Helvetica, sans-serif; color: #111827">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f3f5f8; padding: 40px 15px">
            <tr>
                <td align="center">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 600px;
                            background: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
                        "
                    >
                        <!-- HEADER -->

                        <tr>
                            <td align="center" style="background: #111827; padding: 38px 25px 32px">
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo Wellness"
                                    width="190"
                                    style="
                                        display: block;
                                        width: 190px;
                                        max-width: 100%;
                                        height: auto;
                                        margin: 0 auto;
                                        border: 0;
                                    "
                                />

                                <div
                                    style="width: 45px; height: 2px; background: #b87333; margin: 22px auto 18px"
                                ></div>

                                <div style="color: #ffffff; font-size: 20px; line-height: 28px; font-weight: 600">
                                    Secure Password Reset
                                </div>

                                <div style="color: #9ca3af; font-size: 13px; line-height: 20px; margin-top: 7px">
                                    Keep your Nehdo account secure
                                </div>
                            </td>
                        </tr>

                        <!-- BODY -->

                        <tr>
                            <td style="padding: 42px 45px 40px">
                                <div
                                    style="
                                        font-size: 25px;
                                        line-height: 34px;
                                        font-weight: 700;
                                        color: #111827;
                                        margin-bottom: 18px;
                                    "
                                >
                                    Hello, ${name}
                                </div>

                                <div style="font-size: 15px; line-height: 25px; color: #6b7280">
                                    We received a request to reset the password for your
                                    <strong style="color: #374151"> Nehdo </strong>
                                    account.
                                </div>

                                <div style="font-size: 15px; line-height: 25px; color: #6b7280; margin-top: 10px">
                                    Click the button below to securely create a new password.
                                </div>

                                <!-- RESET BUTTON -->

                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px">
                                    <tr>
                                        <td align="center">
                                            <a
                                                href="${resetLink}"
                                                target="_blank"
                                                style="
                                                    display: inline-block;
                                                    background: #2563eb;
                                                    color: #ffffff;
                                                    text-decoration: none;
                                                    font-size: 15px;
                                                    font-weight: 700;
                                                    padding: 15px 34px;
                                                    border-radius: 9px;
                                                    min-width: 170px;
                                                    text-align: center;
                                                "
                                            >
                                                Reset Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- EXPIRY -->

                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        margin-top: 30px;
                                        background: #fff8e7;
                                        border: 1px solid #f5d58a;
                                        border-radius: 10px;
                                    "
                                >
                                    <tr>
                                        <td width="42" style="padding: 15px 0 15px 16px; font-size: 22px">⏳</td>

                                        <td
                                            style="
                                                padding: 15px 16px 15px 8px;
                                                color: #92400e;
                                                font-size: 13px;
                                                line-height: 20px;
                                                font-weight: 600;
                                            "
                                        >
                                            This password reset link will expire in <strong>10 minutes.</strong>
                                        </td>
                                    </tr>
                                </table>

                                <!-- SECURITY -->

                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px">
                                    <tr>
                                        <td style="border-top: 1px solid #e5e7eb; padding-top: 24px">
                                            <div style="font-size: 13px; line-height: 21px; color: #9ca3af">
                                                If you didn't request this password reset, you can safely ignore this
                                                email. Your account will remain secure.
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- FALLBACK LINK -->

                                <div style="margin-top: 25px; font-size: 12px; line-height: 19px; color: #9ca3af">
                                    If the button above doesn't work, copy and paste the following link into your
                                    browser:
                                </div>

                                <div
                                    style="
                                        margin-top: 8px;
                                        font-size: 11px;
                                        line-height: 18px;
                                        word-break: break-all;
                                        color: #2563eb;
                                    "
                                >
                                    ${resetLink}
                                </div>
                            </td>
                        </tr>

                        <!-- FOOTER -->

                        <tr>
                            <td
                                align="center"
                                style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 30px 25px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo Wellness"
                                    width="145"
                                    style="
                                        display: block;
                                        width: 145px;
                                        max-width: 100%;
                                        height: auto;
                                        margin: 0 auto;
                                        border: 0;
                                    "
                                />

                                <div style="margin-top: 15px; font-size: 13px; line-height: 20px; color: #6b7280">
                                    Connecting Buyers &amp; Sellers with Trust.
                                </div>

                                <div style="width: 35px; height: 1px; background: #d1d5db; margin: 18px auto"></div>

                                <div style="font-size: 11px; line-height: 18px; color: #9ca3af">
                                    © ${new Date().getFullYear()} Nehdo. All Rights Reserved.
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div
                        style="
                            max-width: 600px;
                            margin: 18px auto 0;
                            text-align: center;
                            font-size: 11px;
                            line-height: 18px;
                            color: #9ca3af;
                        "
                    >
                        This is an automated email. Please do not reply to this message.
                    </div>
                </td>
            </tr>
        </table>
    </body>
</html>
`,
  };
};


// ==========================================================
// ACCOUNT BLOCKED MAIL
// ==========================================================

exports.AccountBlockedMail = (email, name) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Nehdo Account Has Been Blocked",

    html: `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Account Blocked - Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f7fb; padding: 40px 15px">
            <tr>
                <td align="center">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 600px;
                            background: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                        "
                    >
                        <!-- HEADER -->

                        <tr>
                            <td
                                align="center"
                                style="background: linear-gradient(135deg, #7f1d1d, #dc2626); padding: 35px 20px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="180"
                                    style="width: 180px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 15px 0 0; color: #fee2e2; font-size: 15px">Account Status Update</p>
                            </td>
                        </tr>

                        <!-- BODY -->

                        <tr>
                            <td style="padding: 45px 35px">
                                <h2 style="margin: 0; text-align: center; color: #111827; font-size: 28px">
                                    Hello, ${name}
                                </h2>

                                <div
                                    style="
                                        margin-top: 25px;
                                        background: #fef2f2;
                                        border: 1px solid #fecaca;
                                        color: #b91c1c;
                                        padding: 18px;
                                        border-radius: 10px;
                                        font-size: 16px;
                                        font-weight: bold;
                                        text-align: center;
                                    "
                                >
                                    Your Nehdo account has been blocked.
                                </div>

                                <p style="margin-top: 25px; color: #6b7280; font-size: 16px; line-height: 1.8">
                                    Your account has been temporarily restricted by the Nehdo administration.
                                </p>

                                <p style="margin-top: 15px; color: #6b7280; font-size: 16px; line-height: 1.8">
                                    You will not be able to access your account or use Nehdo services while your account
                                    remains blocked.
                                </p>

                                <div
                                    style="
                                        margin-top: 30px;
                                        background: #f8fafc;
                                        border: 1px solid #e5e7eb;
                                        padding: 20px;
                                        border-radius: 10px;
                                    "
                                >
                                    <h3 style="margin: 0 0 10px; color: #374151; font-size: 16px">What can you do?</h3>

                                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.7">
                                        If you believe your account was blocked by mistake, please contact our support
                                        team for further assistance.
                                    </p>
                                </div>

                                <p
                                    style="
                                        margin-top: 30px;
                                        color: #9ca3af;
                                        font-size: 14px;
                                        line-height: 1.8;
                                        text-align: center;
                                    "
                                >
                                    We take the security and integrity of the Nehdo platform seriously. Thank you for
                                    your understanding.
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->

                        <tr>
                            <td
                                align="center"
                                style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 25px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="145"
                                    style="width: 145px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px">
                                    Connecting Buyers &amp; Sellers with Trust.
                                </p>

                                <p style="margin-top: 18px; color: #9ca3af; font-size: 13px">
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


// ==========================================================
// PASSWORD CHANGE MAIL
// ==========================================================

exports.PasswordChangeMail = (email, name, password) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Changed Successfully | Nehdo",

    html: `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Changed - Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif">
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 100%; background: #f4f7fb; padding: 30px 15px"
        >
            <tr>
                <td align="center">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 600px;
                            background: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                        "
                    >
                        <!-- HEADER -->

                        <tr>
                            <td
                                align="center"
                                style="background: linear-gradient(135deg, #14532d, #16a34a); padding: 40px 20px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="180"
                                    style="width: 180px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 15px 0 0; color: #dcfce7; font-size: 15px">
                                    Password Changed Successfully
                                </p>
                            </td>
                        </tr>

                        <!-- BODY -->

                        <tr>
                            <td style="padding: 45px 6%">
                                <h2 style="margin: 0; text-align: center; color: #111827; font-size: 28px">
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

                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px">
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
                                                <tr>
                                                    <td style="padding: 9px 0; color: #6b7280">App Name</td>

                                                    <td
                                                        align="right"
                                                        style="padding: 9px 0; color: #111827; font-weight: bold"
                                                    >
                                                        Nehdo
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding: 9px 0; color: #6b7280">Email</td>

                                                    <td
                                                        align="right"
                                                        style="padding: 9px 0; color: #111827; font-weight: bold"
                                                    >
                                                        ${email}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding: 14px 0; color: #6b7280">New Password</td>

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
                                                Security Information
                                            </h3>

                                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.7">
                                                Your password was changed by the administrator. Please keep your new
                                                password secure and do not share it with anyone.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p
                                    style="
                                        margin: 30px 0 0;
                                        text-align: center;
                                        color: #9ca3af;
                                        font-size: 14px;
                                        line-height: 1.8;
                                    "
                                >
                                    If you did not request this password change or believe this was done by mistake,
                                    please contact our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->

                        <tr>
                            <td
                                align="center"
                                style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 28px 20px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="145"
                                    style="width: 145px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px">
                                    Connecting Buyers &amp; Sellers with Trust.
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


// ==========================================================
// ORDER CONFIRMATION MAIL
// ==========================================================

exports.OrderConfirmationMail = (email, name, orderId, orderTotal, paymentMethod) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmed - #${orderId} | Nehdo`,

    html: `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmed - Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4f7fb; padding: 40px 15px">
            <tr>
                <td align="center">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 600px;
                            background: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                        "
                    >
                        <!-- HEADER -->

                        <tr>
                            <td
                                align="center"
                                style="background: linear-gradient(135deg, #14532d, #16a34a); padding: 35px 20px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="180"
                                    style="width: 180px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 15px 0 0; color: #dcfce7; font-size: 15px">Order Confirmation</p>
                            </td>
                        </tr>

                        <!-- BODY -->

                        <tr>
                            <td style="padding: 45px 35px">
                                <h2 style="margin: 0; text-align: center; color: #111827; font-size: 28px">
                                    Thank You, ${name}!
                                </h2>

                                <p
                                    style="
                                        margin-top: 18px;
                                        text-align: center;
                                        color: #6b7280;
                                        font-size: 16px;
                                        line-height: 1.7;
                                    "
                                >
                                    Your order has been successfully placed with Nehdo. We will notify you once your
                                    order is shipped.
                                </p>

                                <div
                                    style="
                                        margin-top: 28px;
                                        background: #f0fdf4;
                                        border: 1px solid #bbf7d0;
                                        color: #15803d;
                                        padding: 18px;
                                        border-radius: 10px;
                                        text-align: center;
                                        font-size: 16px;
                                        font-weight: bold;
                                    "
                                >
                                    ✓ Your order has been confirmed
                                </div>

                                <div
                                    style="
                                        margin-top: 30px;
                                        background: #f8fafc;
                                        border: 1px solid #e5e7eb;
                                        padding: 22px;
                                        border-radius: 12px;
                                    "
                                >
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

                                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280">Order ID</td>

                                            <td
                                                style="
                                                    padding: 8px 0;
                                                    color: #111827;
                                                    font-weight: bold;
                                                    text-align: right;
                                                "
                                            >
                                                #${orderId}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280">Payment Method</td>

                                            <td
                                                style="
                                                    padding: 8px 0;
                                                    color: #111827;
                                                    font-weight: bold;
                                                    text-align: right;
                                                    text-transform: uppercase;
                                                "
                                            >
                                                ${paymentMethod}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding: 12px 0; color: #6b7280">Order Total</td>

                                            <td
                                                style="
                                                    padding: 12px 0;
                                                    color: #15803d;
                                                    font-size: 18px;
                                                    font-weight: bold;
                                                    text-align: right;
                                                "
                                            >
                                                ₹${orderTotal}
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <div
                                    style="
                                        margin-top: 25px;
                                        background: #eff6ff;
                                        border: 1px solid #bfdbfe;
                                        padding: 20px;
                                        border-radius: 10px;
                                    "
                                >
                                    <h3 style="margin: 0 0 10px; color: #1e3a8a; font-size: 16px">What's Next?</h3>

                                    <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.7">
                                        We are preparing your order for shipment. Once your order is shipped, you will
                                        receive another notification with the tracking details.
                                    </p>
                                </div>

                                <p
                                    style="
                                        margin-top: 30px;
                                        text-align: center;
                                        color: #9ca3af;
                                        font-size: 14px;
                                        line-height: 1.8;
                                    "
                                >
                                    Thank you for shopping with Nehdo. We truly appreciate your trust and support.
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->

                        <tr>
                            <td
                                align="center"
                                style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 25px"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="145"
                                    style="width: 145px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px">
                                    Connecting Buyers &amp; Sellers with Trust.
                                </p>

                                <p style="margin-top: 18px; color: #9ca3af; font-size: 13px">
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


// ==========================================================
// ORDER CANCELLED MAIL
// ==========================================================


exports.OrderCancelledMail = (
  email,
  name,
  orderId,
  orderTotal,
  paymentMethod,
  cancellationReason
) => {
  const isOnline =
    paymentMethod?.toLowerCase() === "online";

  const formattedTotal = Number(orderTotal || 0).toLocaleString("en-IN");

  return {
    from: process.env.EMAIL_USER,
    to: email,

    subject: `Order Cancelled • #${orderId} | Nehdo`,

    html: `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Order Cancelled | Nehdo</title>
    </head>

    <body style="margin: 0; padding: 0; background: #f5f7fa; font-family: Arial, Helvetica, sans-serif; color: #1f2937">
        <!-- PREHEADER -->
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0">
            Your Nehdo order #${orderId} has been cancelled successfully.
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f5f7fa">
            <tr>
                <td align="center" style="padding: 40px 15px">
                    <!-- MAIN CONTAINER -->
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 100%;
                            max-width: 600px;
                            background: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            border: 1px solid #e5e7eb;
                        "
                    >
                        <!-- HEADER -->
                        <tr>
                            <td align="center" style="padding: 32px 25px; background: #111827">
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="150"
                                    style="width: 150px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 12px 0 0; color: #d1d5db; font-size: 13px; letter-spacing: 0.3px">
                                    Order Cancellation
                                </p>
                            </td>
                        </tr>

                        <!-- CONTENT -->
                        <tr>
                            <td style="padding: 40px 35px">
                                <!-- STATUS ICON -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <div
                                                style="
                                                    width: 56px;
                                                    height: 56px;
                                                    line-height: 56px;
                                                    border-radius: 50%;
                                                    background: #fef2f2;
                                                    color: #dc2626;
                                                    font-size: 26px;
                                                    font-weight: bold;
                                                    margin: 0 auto;
                                                "
                                            >
                                                ×
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- TITLE -->
                                <h1
                                    style="
                                        margin: 20px 0 0;
                                        text-align: center;
                                        font-size: 26px;
                                        line-height: 1.3;
                                        color: #111827;
                                        font-weight: 700;
                                    "
                                >
                                    Your order has been cancelled
                                </h1>

                                <p
                                    style="
                                        margin: 12px 0 0;
                                        text-align: center;
                                        font-size: 15px;
                                        line-height: 1.7;
                                        color: #6b7280;
                                    "
                                >
                                    Hello ${name}, your order cancellation has been successfully processed.
                                </p>

                                <!-- ORDER NUMBER -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px">
                                    <tr>
                                        <td
                                            align="center"
                                            style="
                                                background: #f9fafb;
                                                border: 1px solid #e5e7eb;
                                                border-radius: 8px;
                                                padding: 14px;
                                            "
                                        >
                                            <span style="font-size: 12px; color: #6b7280"> ORDER NUMBER </span>

                                            <br />

                                            <strong
                                                style="
                                                    display: inline-block;
                                                    margin-top: 4px;
                                                    font-size: 16px;
                                                    color: #111827;
                                                "
                                            >
                                                #${orderId}
                                            </strong>
                                        </td>
                                    </tr>
                                </table>

                                <!-- ORDER DETAILS -->
                                <table
                                    width="100%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="margin-top: 28px; border: 1px solid #e5e7eb; border-radius: 10px"
                                >
                                    <tr>
                                        <td colspan="2" style="padding: 18px 20px; border-bottom: 1px solid #e5e7eb">
                                            <strong style="font-size: 16px; color: #111827"> Order Details </strong>
                                        </td>
                                    </tr>

                                    <!-- PAYMENT -->
                                    <tr>
                                        <td style="padding: 14px 20px; color: #6b7280; font-size: 14px">
                                            Payment Method
                                        </td>

                                        <td
                                            align="right"
                                            style="
                                                padding: 14px 20px;
                                                color: #111827;
                                                font-size: 14px;
                                                font-weight: 600;
                                                text-transform: capitalize;
                                            "
                                        >
                                            ${paymentMethod || "COD"}
                                        </td>
                                    </tr>

                                    <!-- TOTAL -->
                                    <tr>
                                        <td style="padding: 14px 20px 18px; color: #6b7280; font-size: 14px">
                                            Order Total
                                        </td>

                                        <td
                                            align="right"
                                            style="
                                                padding: 14px 20px 18px;
                                                color: #111827;
                                                font-size: 18px;
                                                font-weight: 700;
                                            "
                                        >
                                            ₹${formattedTotal}
                                        </td>
                                    </tr>
                                </table>

                                <!-- ONLINE PAYMENT / REFUND -->
                                ${isOnline ? `
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px">
                                    <tr>
                                        <td
                                            style="
                                                background: #f0fdf4;
                                                border: 1px solid #bbf7d0;
                                                border-radius: 10px;
                                                padding: 20px;
                                            "
                                        >
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td valign="top" style="width: 36px">
                                                        <div
                                                            style="
                                                                width: 28px;
                                                                height: 28px;
                                                                line-height: 28px;
                                                                text-align: center;
                                                                border-radius: 50%;
                                                                background: #dcfce7;
                                                                color: #15803d;
                                                                font-size: 16px;
                                                                font-weight: bold;
                                                            "
                                                        >
                                                            ✓
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <strong style="display: block; color: #166534; font-size: 16px">
                                                            Refund Information
                                                        </strong>

                                                        <p
                                                            style="
                                                                margin: 8px 0 0;
                                                                color: #374151;
                                                                font-size: 14px;
                                                                line-height: 1.7;
                                                            "
                                                        >
                                                            Since your payment was completed online, the applicable
                                                            refund will be processed to your original payment method.
                                                        </p>

                                                        <p
                                                            style="
                                                                margin: 8px 0 0;
                                                                color: #6b7280;
                                                                font-size: 13px;
                                                                line-height: 1.6;
                                                            "
                                                        >
                                                            Please allow some time for the refund to appear in your bank
                                                            account or payment provider.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                ` : `
                                <!-- COD -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px">
                                    <tr>
                                        <td
                                            style="
                                                background: #f9fafb;
                                                border: 1px solid #e5e7eb;
                                                border-radius: 10px;
                                                padding: 20px;
                                            "
                                        >
                                            <strong style="display: block; color: #374151; font-size: 16px">
                                                Payment Information
                                            </strong>

                                            <p
                                                style="
                                                    margin: 8px 0 0;
                                                    color: #6b7280;
                                                    font-size: 14px;
                                                    line-height: 1.7;
                                                "
                                            >
                                                This was a Cash on Delivery order, so no online refund is required.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` }

                                <!-- CANCELLATION REASON -->
                                ${cancellationReason ? `
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px">
                                    <tr>
                                        <td
                                            style="
                                                background: #fffbeb;
                                                border: 1px solid #fde68a;
                                                border-radius: 10px;
                                                padding: 20px;
                                            "
                                        >
                                            <strong style="display: block; color: #92400e; font-size: 16px">
                                                Cancellation Reason
                                            </strong>

                                            <p
                                                style="
                                                    margin: 8px 0 0;
                                                    color: #6b7280;
                                                    font-size: 14px;
                                                    line-height: 1.7;
                                                "
                                            >
                                                ${cancellationReason}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` : ""}

                                <!-- SUPPORT -->
                                <p
                                    style="
                                        margin: 30px 0 0;
                                        text-align: center;
                                        color: #6b7280;
                                        font-size: 13px;
                                        line-height: 1.7;
                                    "
                                >
                                    If you did not request this cancellation or believe this was done by mistake, please
                                    contact our support team.
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td
                                align="center"
                                style="padding: 28px 25px; background: #f9fafb; border-top: 1px solid #e5e7eb"
                            >
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="120"
                                    style="width: 120px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <p style="margin: 10px 0 0; color: #6b7280; font-size: 13px">
                                    Connecting Buyers &amp; Sellers with Trust.
                                </p>

                                <p style="margin: 14px 0 0; color: #9ca3af; font-size: 12px">
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




// ==========================================================
// DYNAMIC MAIL
// ==========================================================


exports.DynamicMail = ({ email, name, subject, message }) => {

  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,

    html: `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>${subject}</title>

        <style>
            @media only screen and (max-width: 620px) {
                .main-container {
                    width: 100% !important;
                }

                .content {
                    padding: 30px 20px !important;
                }

                .header {
                    padding: 30px 20px !important;
                }

                .footer {
                    padding: 25px 20px !important;
                }

                .title {
                    font-size: 24px !important;
                }

                .message-box {
                    padding: 20px !important;
                }
            }
        </style>
    </head>

    <body style="margin: 0; padding: 0; background: #f3f6fa; font-family: Arial, Helvetica, sans-serif; color: #1f2937">
        <!-- MAIN WRAPPER -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f3f6fa">
            <tr>
                <td align="center" style="padding: 45px 15px">
                    <!-- EMAIL CONTAINER -->
                    <table
                        class="main-container"
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                            width: 600px;
                            max-width: 600px;
                            background: #ffffff;
                            border-radius: 14px;
                            overflow: hidden;
                            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08);
                        "
                    >
                        <!-- ================= HEADER ================= -->
                        <tr>
                            <td class="header" align="center" style="padding: 32px 25px; background: #111827">
                                <!-- LOGO -->
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="165"
                                    style="width: 165px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <!-- HEADER TEXT -->
                                <p
                                    style="
                                        margin: 14px 0 0;
                                        color: #cbd5e1;
                                        font-size: 14px;
                                        line-height: 20px;
                                        letter-spacing: 0.3px;
                                    "
                                >
                                    Connecting Buyers &amp; Sellers with Trust
                                </p>
                            </td>
                        </tr>

                        <!-- ================= BLUE LINE ================= -->
                        <tr>
                            <td style="height: 4px; background: #2563eb; font-size: 0; line-height: 0">&nbsp;</td>
                        </tr>

                        <!-- ================= CONTENT ================= -->
                        <tr>
                            <td class="content" style="padding: 42px 40px">
                                <!-- GREETING -->
                                <p style="margin: 0 0 8px; color: #6b7280; font-size: 15px; line-height: 24px">
                                    Hello,
                                </p>

                                <h1
                                    class="title"
                                    style="
                                        margin: 0;
                                        color: #111827;
                                        font-size: 28px;
                                        line-height: 36px;
                                        font-weight: 700;
                                    "
                                >
                                    ${name}
                                </h1>

                                <!-- SUBJECT -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px">
                                    <tr>
                                        <td style="border-left: 4px solid #2563eb; padding-left: 14px">
                                            <p
                                                style="
                                                    margin: 0;
                                                    color: #111827;
                                                    font-size: 18px;
                                                    line-height: 26px;
                                                    font-weight: 600;
                                                "
                                            >
                                                ${subject}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- MESSAGE BOX -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px">
                                    <tr>
                                        <td
                                            class="message-box"
                                            style="
                                                background: #f8fafc;
                                                border: 1px solid #e5e7eb;
                                                border-radius: 10px;
                                                padding: 24px;
                                            "
                                        >
                                            <div style="color: #374151; font-size: 15px; line-height: 27px">
                                                ${message}
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- SUPPORT MESSAGE -->
                                <p style="margin: 28px 0 0; color: #6b7280; font-size: 14px; line-height: 23px">
                                    If you have any questions or need further assistance, please contact the Nehdo
                                    support team.
                                </p>

                                <!-- DIVIDER -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px">
                                    <tr>
                                        <td style="height: 1px; background: #e5e7eb; font-size: 0; line-height: 0">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>

                                <!-- REGARDS -->
                                <p style="margin: 25px 0 0; color: #374151; font-size: 14px; line-height: 22px">
                                    Regards,<br />
                                    <strong style="color: #111827"> Nehdo Team </strong>
                                </p>
                            </td>
                        </tr>

                        <!-- ================= FOOTER ================= -->
                        <tr>
                            <td
                                class="footer"
                                align="center"
                                style="background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 28px 25px"
                            >
                                <!-- FOOTER LOGO -->
                                <img
                                    src="${logoUrl}"
                                    alt="Nehdo"
                                    width="120"
                                    style="width: 120px; max-width: 100%; height: auto; display: block; margin: 0 auto"
                                />

                                <!-- TAGLINE -->
                                <p style="margin: 12px 0 0; color: #6b7280; font-size: 13px; line-height: 20px">
                                    Connecting Buyers &amp; Sellers with Trust.
                                </p>

                                <!-- COPYRIGHT -->
                                <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px; line-height: 18px">
                                    © ${new Date().getFullYear()} Nehdo. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <!-- OUTSIDE FOOTER -->
                    <p style="margin: 18px 0 0; color: #9ca3af; font-size: 11px; line-height: 18px; text-align: center">
                        This is an automated email from Nehdo. Please do not reply directly to this email.
                    </p>
                </td>
            </tr>
        </table>
    </body>
</html>
`,
  };
};
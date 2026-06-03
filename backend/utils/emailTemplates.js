
const verifyEmailTemplate = (user, otp) => {

  return `
<div
  style="
    background:#030805;
    padding:40px 20px;
    font-family:Arial,sans-serif;
    color:#E2E8F0;
  "
>

  <div
    style="
      max-width:600px;
      margin:auto;
      background:#07110c;
      border:1px solid rgba(16,185,129,0.15);
      border-radius:24px;
      overflow:hidden;
      box-shadow:0 0 40px rgba(16,185,129,0.08);
    "
  >

    <!-- HEADER -->

    <div
      style="
        padding:32px;
        border-bottom:1px solid rgba(16,185,129,0.1);
        background:linear-gradient(
          135deg,
          rgba(16,185,129,0.12),
          rgba(20,184,166,0.08)
        );
      "
    >

      <h1
        style="
          margin:0;
          font-size:28px;
          font-weight:800;
          color:white;
          letter-spacing:-0.5px;
        "
      >
        FinPilot
        <span style="color:#34d399;">
          AI
        </span>
      </h1>

      <p
        style="
          margin-top:10px;
          color:#94a3b8;
          font-size:14px;
          line-height:1.6;
        "
      >
        Intelligent Financial Management Platform
      </p>

    </div>

    <!-- BODY -->

    <div style="padding:40px 32px;">

      <div
        style="
          display:inline-block;
          background:rgba(16,185,129,0.12);
          border:1px solid rgba(16,185,129,0.2);
          color:#34d399;
          padding:8px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:700;
          margin-bottom:24px;
        "
      >
        EMAIL VERIFICATION
      </div>

      <h2
        style="
          margin:0 0 18px;
          font-size:30px;
          line-height:1.3;
          color:white;
        "
      >
        Verify your account
      </h2>

      <p
        style="
          color:#cbd5e1;
          font-size:15px;
          line-height:1.8;
          margin-bottom:20px;
        "
      >
        Hello <strong>${user.name}</strong>,
      </p>

      <p
        style="
          color:#94a3b8;
          font-size:15px;
          line-height:1.8;
          margin-bottom:30px;
        "
      >
        Thank you for registering with
        FinPilot AI.
        Use the verification code below
        to activate your account securely.
      </p>

      <!-- OTP BOX -->

      <div
        style="
          background:#03150d;
          border:1px solid rgba(16,185,129,0.2);
          border-radius:20px;
          padding:28px;
          text-align:center;
          margin-bottom:30px;
        "
      >

        <p
          style="
            margin:0 0 12px;
            color:#94a3b8;
            font-size:13px;
            letter-spacing:1px;
            text-transform:uppercase;
            font-weight:700;
          "
        >
          Your Verification OTP
        </p>

        <div
          style="
            font-size:42px;
            font-weight:900;
            letter-spacing:10px;
            color:#34d399;
          "
        >
          ${otp}
        </div>

      </div>

      <!-- INFO -->

      <div
        style="
          margin-top:10px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:16px;
          padding:20px;
        "
      >

        <p
          style="
            margin:0;
            color:#cbd5e1;
            font-size:14px;
            line-height:1.8;
          "
        >
          ⏳ This OTP will expire in
          <strong style="color:#34d399;">
            5 minutes
          </strong>.
        </p>

      </div>

      <p
        style="
          margin-top:28px;
          color:#64748b;
          font-size:13px;
          line-height:1.7;
        "
      >
        If you did not create this account,
        you can safely ignore this email.
      </p>

    </div>

    <!-- FOOTER -->

    <div
      style="
        padding:24px 32px;
        border-top:1px solid rgba(16,185,129,0.08);
        text-align:center;
      "
    >

      <p
        style="
          margin:0;
          color:#64748b;
          font-size:12px;
          line-height:1.8;
        "
      >
        © 2026 FinPilot AI.
        Smart Personal Finance Platform.
      </p>

    </div>

  </div>

</div>
`;
};

const resetPasswordEmailTemplate = (user,resetUrl)=>{
return `
<div
  style="
    background:#030805;
    padding:40px 20px;
    font-family:Arial,sans-serif;
    color:#E2E8F0;
  "
>

  <div
    style="
      max-width:600px;
      margin:auto;
      background:#07110c;
      border:1px solid rgba(16,185,129,0.15);
      border-radius:24px;
      overflow:hidden;
      box-shadow:0 0 40px rgba(16,185,129,0.08);
    "
  >

    <!-- HEADER -->

    <div
      style="
        padding:32px;
        border-bottom:1px solid rgba(16,185,129,0.1);
        background:linear-gradient(
          135deg,
          rgba(16,185,129,0.12),
          rgba(20,184,166,0.08)
        );
      "
    >

      <h1
        style="
          margin:0;
          font-size:28px;
          font-weight:800;
          color:white;
          letter-spacing:-0.5px;
        "
      >
        FinPilot
        <span style="color:#34d399;">
          AI
        </span>
      </h1>

      <p
        style="
          margin-top:10px;
          color:#94a3b8;
          font-size:14px;
          line-height:1.6;
        "
      >
        Secure financial intelligence platform
      </p>

    </div>

    <!-- BODY -->

    <div style="padding:40px 32px;">

      <div
        style="
          display:inline-block;
          background:rgba(16,185,129,0.12);
          border:1px solid rgba(16,185,129,0.2);
          color:#34d399;
          padding:8px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:700;
          margin-bottom:24px;
        "
      >
        PASSWORD RESET REQUEST
      </div>

      <h2
        style="
          margin:0 0 18px;
          font-size:30px;
          line-height:1.3;
          color:white;
        "
      >
        Reset your password
      </h2>

      <p
        style="
          color:#cbd5e1;
          font-size:15px;
          line-height:1.8;
          margin-bottom:20px;
        "
      >
        Hello <strong>${user.name}</strong>,
      </p>

      <p
        style="
          color:#94a3b8;
          font-size:15px;
          line-height:1.8;
          margin-bottom:30px;
        "
      >
        We received a request to reset your
        FinPilot AI account password.
        Click the button below to securely
        create a new password.
      </p>

      <!-- BUTTON -->
        <a
  href="${resetUrl}"
  style="
    display:inline-block;
    background:#10b981;
    color:#ffffff !important;
    text-decoration:none;
    padding:16px 28px;
    border-radius:14px;
    font-size:14px;
    font-weight:800;
    letter-spacing:0.3px;
    box-shadow:0 10px 25px rgba(16,185,129,0.25);
    font-family:Arial,sans-serif;
  "
>
  Reset Password
</a>

      <!-- INFO BOX -->

      <div
        style="
          margin-top:35px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:16px;
          padding:20px;
        "
      >

        <p
          style="
            margin:0;
            color:#cbd5e1;
            font-size:14px;
            line-height:1.8;
          "
        >
          ⏳ This password reset link will
          expire in
          <strong style="color:#34d399;">
            15 minutes
          </strong>.
        </p>

      </div>

      <p
        style="
          margin-top:28px;
          color:#64748b;
          font-size:13px;
          line-height:1.7;
        "
      >
        If you did not request this password
        reset, you can safely ignore this email.
        Your account will remain secure.
      </p>

    </div>

    <!-- FOOTER -->

    <div
      style="
        padding:24px 32px;
        border-top:1px solid rgba(16,185,129,0.08);
        text-align:center;
      "
    >

      <p
        style="
          margin:0;
          color:#64748b;
          font-size:12px;
          line-height:1.8;
        "
      >
        © 2026 FinPilot AI.
        Intelligent Personal Finance Platform.
      </p>

    </div>

  </div>

</div>
`;
}
module.exports = {verifyEmailTemplate, resetPasswordEmailTemplate};
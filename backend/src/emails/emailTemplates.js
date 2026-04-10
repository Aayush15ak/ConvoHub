export function createWelcomeEmailTemplate(name, clientURL) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome</title>
</head>

<body style="margin:0; padding:0; background:#0b1220; font-family:Arial, sans-serif;">

  <!-- Outer Wrapper -->
  <div style="max-width:600px; margin:40px auto; background:#111827; border-radius:16px; overflow:hidden;">

    <!-- Header -->
    <div style="padding:40px; text-align:center; background:linear-gradient(135deg,#4f46e5,#22c55e);">
      <div style="font-size:42px;">💬</div>
      <h1 style="margin:10px 0 0; color:#fff; font-size:26px;">
        Welcome to ConvoHub!
      </h1>
      <p style="color:#e5e7eb; margin:8px 0 0;">
        Real-time conversations made simple
      </p>
    </div>

    <!-- Body -->
    <div style="padding:35px; color:#e5e7eb;">

      <h2 style="margin:0 0 10px; color:#ffffff;">
        Hey ${name} 👋
      </h2>

      <p style="line-height:1.6; color:#cbd5e1;">
        We’re excited to have you on board. ConvoHub helps you connect instantly with friends, family, and teams — anytime, anywhere.
      </p>

      <!-- Steps -->
      <div style="background:#1f2937; padding:20px; border-radius:12px; margin:20px 0;">
        <p style="margin:0 0 10px; font-weight:bold; color:#93c5fd;">
          Get started in a few steps:
        </p>
        <ul style="margin:0; padding-left:18px; color:#cbd5e1; line-height:1.8;">
          <li>Set up your profile</li>
          <li>Add your contacts</li>
          <li>Start chatting instantly</li>
          <li>Share your memories via photos , videos and more</li>
        </ul>
      </div>

      <!-- Button -->
      <div style="text-align:center; margin:30px 0;">
        <a href="${clientURL}"
           style="background:linear-gradient(135deg,#4f46e5,#22c55e);
                  padding:14px 30px;
                  border-radius:10px;
                  color:#fff;
                  text-decoration:none;
                  font-weight:bold;
                  display:inline-block;">
          Open ConvoHub →
        </a>
      </div>        

      <p style="font-size:13px; color:#94a3b8; text-align:center;">
        If you did not sign up, you can safely ignore this email.
      </p>
    </div>   
  </div>

</body>
</html>
`;
}
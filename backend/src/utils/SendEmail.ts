import nodemailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kalideveloper865@gmail.com",
    pass: "nuul vfjv ezkn emro",
  },
});

/// create afucntion to send email
const emailTemplate = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 200px;
          height: auto;
          margin-bottom: 20px;
        }
        .otp-code {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 4px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          letter-spacing: 2px;
          color: #2c5282;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #edf2f7;
          font-size: 14px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img class="logo" src="https://www.reachoutmbuya.org/wp-content/uploads/2019/06/Logoz1.png" alt="ROM E-Recruitment">
          <h2>Email Verification</h2>
        </div>
        
        <p>Hello,{{ fullname }}</p>
        <p>Thank you for registering with ROM E-Recruitment. To complete your registration, please use the verification code below:</p>
        
        <div class="otp-code">
          {{ otpCode }}
        </div>
        
        <p>This code will expire in 10 minutes for security purposes.</p>
        <p>If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} ROM E-Recruitment. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
`;
export const sendEmail = async (
  email: string,
  subject: string,
  otpCode: string,
  fullname: string
) => {
  const replaceVariables = (
    template: string,
    variables: Record<string, string>
  ) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{ ${key} }}`, "g");
      result = result.replace(regex, value);
    }
    return result;
  };
  const emailHtml = replaceVariables(emailTemplate, { otpCode, fullname });

  const mailOptions = {
    from: "kalideveloper865@gmail.com",
    to: email,
    subject: subject,
    html: emailHtml,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    } else {
      console.log("Email sent: " + info.response);
      return "Email sent: " + info.response;
    }
  });
};

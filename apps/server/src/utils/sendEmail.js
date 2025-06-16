// apps/backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.NODE_ENV !== 'development', // Use true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: `<span class="math-inline">\{process\.env\.FROM\_NAME\} <</span>{process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // HTML content for the email body
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
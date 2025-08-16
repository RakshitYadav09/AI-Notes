// utils/email.js
// Handles sending emails with summaries
import nodemailer from 'nodemailer';

export async function sendSummaryEmail({ summary, recipients }) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) throw new Error('Missing email credentials');

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if not using Gmail
    auth: { user, pass }
  });

  const mailOptions = {
    from: user,
    to: recipients.join(','),
    subject: 'AI Meeting Summary',
    text: summary
  };

  await transporter.sendMail(mailOptions);
}

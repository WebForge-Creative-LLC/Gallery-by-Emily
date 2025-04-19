import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,      // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function handler(event) {
  try {
    const { name, email, description } = JSON.parse(event.body);
    await transporter.sendMail({
      from: `"Gallery by Emily" <${process.env.SMTP_USER}>`,
      to:   process.env.CONTACT_EMAIL,
      subject: `New commission from ${name}`,
      text: `${description}\n\nFrom: ${name} <${email}>`
    });
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
} 
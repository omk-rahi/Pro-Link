import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, text }) => {
  const info = {
    from: "Rahi Omkar <rahiomkar0189@gmail.com>",
    to,
    subject,
    text,
  };

  await transporter.sendMail(info);
};

export default sendMail;

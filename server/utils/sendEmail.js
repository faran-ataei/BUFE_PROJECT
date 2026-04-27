import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


const sendEmail = (client, subject, text) => {
  const mailOptions = {
    from: "atakentcaybahcesivebufe@gmail.com",
    to: client,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};
export default sendEmail;
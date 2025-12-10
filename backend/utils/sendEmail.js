// import nodemailer from "nodemailer";

// export const sendConfirmationEmail = async ({ to, teamName, teamId }) => {
//   if (!process.env.SMTP_HOST) {
//     console.log("Email disabled in dev. Would send to:", to);
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT || "587"),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Team Reg Platform" <${process.env.SMTP_USER}>`,
//     to,
//     subject: `Team Registration Successful - ${teamName}`,
//     text: `Your team "${teamName}" has been registered. Team ID: ${teamId}`,
//   });
// };


import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};

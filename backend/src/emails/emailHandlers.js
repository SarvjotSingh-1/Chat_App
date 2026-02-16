// this is using resend

// import { resendClient, sender } from "../lib/resend.js";
// import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

// export const sendWelcomeEmail = async (email, name, clientURL) => {
//   console.log("sendWelcomeEmail called");

//   // Make sure sender values are trimmed and valid
//   const fromName = sender.name?.trim() || "Chatify";
//   const fromEmail = sender.email?.trim() || "onboarding@resend.dev";

//   try {
//     const response = await resendClient.emails.send({
//       from: `${fromName} <${fromEmail}>`, // Name <email> ✅
//       to: email,
//       subject: "Welcome to Chatify!",
//       html: createWelcomeEmailTemplate(name, clientURL),
//     });

//     console.log("Welcome Email sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error sending welcome email:", error);
//     throw new Error("Failed to send welcome email");
//   }
// };

// below code using nodemailer
import { transporter } from "../lib/nodemailer.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";
import { ENV } from "../lib/env.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  console.log("sendWelcomeEmail called");

  try {
    const info = await transporter.sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.EMAIL_FROM}>`, // Name <email>
      to: email,
      subject: "Welcome to Chatify!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    console.log("Welcome Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

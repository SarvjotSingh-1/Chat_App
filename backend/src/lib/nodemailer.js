import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config({ quiet: true });

import { ENV } from "../lib/env.js";

// Create reusable transporter using Gmail's SMTP service (or any other service you prefer)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change to another SMTP service if needed
  auth: {
    user: ENV.EMAIL_FROM, // The sender email (from your .env file)
    pass: ENV.EMAIL_PASSWORD, // Gmail app password or SMTP password (from your .env file)
  },
});

export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};

export { transporter };

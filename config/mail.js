import nodemailer from 'nodemailer';

const GMAIL_PASS = process.env.GMAIL_PASS ;
export const transporter = nodemailer.createTransport({
  service: "gmail", 
  host: 'stmp.gmail.com',
  port:587,
  secure:false,
  auth: {
    user: "jordan.garske.j@gmail.com",
    pass: GMAIL_PASS
  }
});
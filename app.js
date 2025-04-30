import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';

import { fileURLToPath } from 'url';

import {photos, getCalendarEvent} from './cronTask.js';
export const app = express();
app.use(cors());
app.use(express.json());
app.locals.photo = {};
app.locals.calendarEvents = {};
await photos();
await getCalendarEvent();
const PORT = process.env.PORT ||8080;
const GMAIL_PASS = process.env.GMAIL_PASS ;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//get request
app.get("/api/calendar", async (req, res) => {
  try{
    res.json(req.app.locals.calendarEvents);
  } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ error: "Failed to fetch calendar data" });
   }
  // try {
  //     const userRef = ref(db, 'dates/');
  //     const snapshot = await get(userRef);
      
  //     if (!snapshot.exists()) {
  //         return res.json([]);
  //     }

  //     const data = snapshot.val();
  //     const dates = Object.keys(data).map(key => ({
  //         ...data[key],
  //         id: key,
  //         image: key.image ?  req.app.locals.photo[data[key].image]: null 
  //     }));
  //     console.log(req.app.locals.photo)
  //     res.json(dates);
  // } catch (error) {
  //     console.error("Error fetching calendar data:", error);
  //     res.status(500).json({ error: "Failed to fetch calendar data" });
  // }
});
// post request
const transporter = nodemailer.createTransport({
  service: "gmail", 
  host: 'stmp.gmail.com',
  port:587,
  secure:false,
  auth: {
    user: "jordan.garske.j@gmail.com",
    pass: GMAIL_PASS
  }
});

app.post("/api/send", (req, res) => {      const mailOptions = {
  from: 'jordan.garske.j@gmail.com',
  to: 'jordan.garske.j@gmail.com',
  subject: req.body.message,
  text: req.body.message,
  html: '<b>Hello world?</b>'
};      
transporter.sendMail(mailOptions, (error, info) => {
   if(error){

     return res.status(500).send(error);
   }
   res.status(200).send("Email sent successfully");
});
});    

// sets all routes for react router frontend
app.use(express.static(path.join(__dirname, "./build/client")))

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "./build/client/index.html"));
});

app.listen(PORT, () =>console.log("Server started"))

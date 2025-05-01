import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {photos, getCalendarEvent,newsLetterUrl} from './cronTask.js';
import {transporter} from './config/mail.js'
// init app 
export const app = express();
app.use(cors());
app.use(express.json());
app.locals.photo = {};
app.locals.calendarEvents = {};
app.locals.newsList = [];

//get data
await photos();
await getCalendarEvent();
await newsLetterUrl();
//app env
const PORT = process.env.PORT ||8080;


// set import-from system
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

});
app.get("/api/get/newsletter", async (req, res) => {
  try{
    res.json(req.app.locals.newsList);
  } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ error: "Failed to fetch calendar data" });
   }

});
// post request


app.post("/api/send", (req, res) => {      
  const mailOptions = {
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
  





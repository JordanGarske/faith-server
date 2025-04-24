const express =require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const app = express();
const { onValue, get, ref } = require("firebase/database");
const { db } = require("./config/firebase.js");
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT ||8080;
const GMAIL_PASS = process.env.GMAIL_PASS ;

app.listen(PORT, () =>console.log("Server started"))
app.get("/api/calendar", async (req, res) => {
  try {
      const userRef = ref(db, 'dates/');
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
          return res.json([]);
      }

      const data = snapshot.val();
      const dates = Object.keys(data).map(key => ({
          ...data[key],
          id: key
      }));

      res.json(dates);
  } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ error: "Failed to fetch calendar data" });
  }
});
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

app.use(express.static(path.join(__dirname, "./build/client")))
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "./build/client/index.html"));
});





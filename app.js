const express =require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT ||8080;
const GMAIL_PASS = process.env.GMAIL_PASS ;


app.listen(PORT, () =>console.log("Server started"))

app.use(express.static(path.join(__dirname, "./build/client")))
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "./build/client/index.html"));
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
    subject: 'Hello world?',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
  };      
  console.log(req);
  transporter.sendMail(mailOptions, (error, info) => {
     if(error){

       return res.status(500).send(error);
     }
     res.status(200).send("Email sent successfully");
  });
});    

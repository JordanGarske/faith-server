const express =require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT ||8080;

app.listen(PORT, () =>console.log("Server started"))

app.use(express.static(path.join(__dirname, "./build/client")))
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "./build/client/index.html"));
});

const GmailPass = process.env.GMAILPASS;
const transporter = nodemailer.createTransport({
    service: "gmail", 
    host: 'stmp.gmail.com',
    port:587,
    secure:false,
    auth: {
      user: "jordan.garske.j@gmail.com",
      pass: GmailPass
    }
  });

app.post("/api/send", (req, res) => {      const mailOptions = {
    from: 'jordan.garske.j@gmail.com',
    to: 'jordan.garske.j@gmail.com',
    subject: 'Hello world?',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
  };      
  transporter.sendMail(mailOptions, (error, info) => {
     if(error){
       return res.status(500).send(error);
     }
     res.status(200).send("Email sent successfully");
  });
});    
//       user: "jordan.garske.j@gmail.com",
//       pass: "pywk siqp psly smvj"
// const mailOptions = {
//     from: 'jordan.garske.j@gmail.com',
//     to: 'jordan.garske.j@gmail.com',
//     subject: 'Hello world?',
//     text: 'Hello world?',
//     html: '<b>Hello world?</b>'
//   };      
// const sendMail = async(transporter, mailOptions) =>{
//     try{
//         await transporter.sendMail(mailOptions)
//     }catch(error){
//         console.log(error)
//     }
// }
// sendMail(transporter, mailOptions);
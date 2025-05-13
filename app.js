import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {photos, getCalendarEvent, newsLetterUrl, youtubeVideos,newsLetterPdfUrl} from './cronTask.js';
import {transporter} from './config/mail.js';
import axios from 'axios';
import cookieParser from 'cookie-parser';
// init app 
export const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.locals.photo = {};
app.locals.calendarEvents = {
  1:[], 2:[], 3:[], 4:[], 5:[], 6:[],
  7:[], 8:[], 9:[], 10:[], 11:[], 12:[]
};
app.locals.newsList = [[],[],[],[],[],[],[],[],[],[],[],[]];
app.locals.pdfList = ['','','','','','','','','','','',''];
app.locals.youtube = [];

//get data
await photos();
await getCalendarEvent();
await newsLetterUrl();
await newsLetterPdfUrl();
youtubeVideos();
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
app.get("/api/get/pdf-newsletter", async (req, res) => {
  try{
    res.json(req.app.locals.pdfList);
  } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ error: "Failed to fetch calendar data" });
   }
});

app.get("/api/get/videos", async (req, res) => {
  try{
    res.json(req.app.locals.youtube);
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


const ICON_CMO_API = "https://secure3.iconcmo.com/api/";

// Add this endpoint to check session
app.get('/api/check-session', (req, res) => {
  const sessionCookie = req.cookies.church_directory;
  res.json({ loggedIn: !!sessionCookie });
});

// Update the proxy endpoint to properly handle authentication
// app.post('/api/proxy', async (req, res) => {
//   try {
//     const { request } = req.body;

//     // Validate request exists
//     if (!request) {
//       return res.status(400).json({ error: 'Request object is required' });
//     }

//     // Parse the request if it's a string (might be already parsed)
//     const requestObj = typeof request === 'string' ? JSON.parse(request) : request;

//     // Add session from cookie if available
//     if (req.cookies.church_directory) {
//       requestObj.Auth = requestObj.Auth || {};
//       requestObj.Auth.Session = req.cookies.church_directory;
//     }

//     // Make the API call
//     const response = await axios.post(ICON_CMO_API, {
//       request: JSON.stringify(requestObj)
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     // Set session cookie if we got a new session
//     if (response.data && response.data.session) {
//       res.cookie('church_directory', response.data.session, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'strict',
//         domain: process.env.COOKIE_DOMAIN || req.hostname
//       });
//     }
//     console.log(response.data)

//   } catch (error) {
//     console.error('Proxy error:', error);
//     if (error.response) {
//       // Forward the API error response
//       res.status(error.response.status).json(error.response.data);
//     } else {
//       res.status(500).json({ error: 'Proxy error' });
//     }
//   }
// });




app.post('/api/proxy', async (req, res) => {
  try {
    const { request } = req.body;
    const requestObj = typeof request === 'string' ? JSON.parse(request) : request;
    const query = requestObj;
    console.log(requestObj)
    const x = await  fetch("https://secure3.iconcmo.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(query)
    })
    const file = await x.json();

    const a = new Set();
    const items = []
    file['directory'].forEach(element => {
      if (element['status']==='ActMem'){
        items.push(element)
      }
      a.add(element['status'])
    });   
    console.log(items.length)
    // Send the request
    file['directory'] = items
    file['statistics']['records'] = items.length
    res.json(file)

  } catch (error) {
    console.error('Proxy error:', error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Proxy error' });
    }
  }
});





// sets all routes for react router frontend
app.use(express.static(path.join(__dirname, "./build/client")))

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "./build/client/index.html"));
});

app.listen(PORT, () =>console.log("Server started", PORT))
  
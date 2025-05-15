import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {photos, getCalendarEvent, newsLetterUrl, youtubeVideos,newsLetterPdfUrl, getImgsObject} from './cronTask.js';
import {transporter} from './config/mail.js';
import cookieParser from 'cookie-parser';
// init app 
export const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.locals.photo = {};
app.locals.calendarEvents = {
  1:[], 2:[], 3:[], 4:[], 5:[], 6:[],
  7:[], 8:[], 9:[], 10:[], 11:[], 12:[]
};
app.locals.newsList = [[],[],[],[],[],[],[],[],[],[],[],[]];
app.locals.pdfList = ['','','','','','','','','','','',''];
app.locals.youtube = [];
app.locals.carousel = [];
app.locals.aboutUs = [];

//get data
await photos();
// await getCalendarEvent();
await newsLetterUrl();
await newsLetterPdfUrl();
app.locals.carousel = await getImgsObject('carousel/');
app.locals.aboutUs = await getImgsObject('about-us/');
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
app.get("/api/carousel", async (req, res) => {
  try{
    res.json(req.app.locals.carousel);
  } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({ error: "Failed to fetch calendar data" });
   }

});
app.get("/api/about-us", async (req, res) => {
  try{
    res.json(req.app.locals.aboutUs);
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

app.post('/login', async (req, res) => {
  console.log(req.cookies)
    if (req.cookies.church_directory){
      res.status(200).send('login')
    }
    else{
      const { request } = req.body;
      const requestObj = typeof request === 'string' ? JSON.parse(request) : request;
      const query = requestObj;
      const account = await  fetch("https://secure3.iconcmo.com/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(query)
      })
      const file = await account.json();
      if(file.number === 300){
        res.status(401).send('failed login')
        return
      }
      res.cookie('church_directory', file.session, {
        maxAge: 4 * 60 * 60 * 1000, // 1 day
        httpOnly: true,              // can't be accessed by JS in the browser
        secure: true,               // true if using HTTPS
        sameSite: 'lax'
      });
        }

});

// Add this endpoint to check session
app.get('/api/check-session', (req, res) => {
  const sessionCookie = req.cookies.church_directory;
  console.log('cookie', sessionCookie)
  res.json({ loggedIn: !!sessionCookie });
});




app.post('/api/proxy', async (req, res) => {
  try {
    const { request } = req.body;
    const requestObj = typeof request === 'string' ? JSON.parse(request) : request;
    const query = requestObj;
    if (req.cookies.church_directory){
      query.Auth = {"Session": req.cookies.church_directory}
    }
    const x = await  fetch("https://secure3.iconcmo.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(query)
    })
    const file = await x.json();
    if(file.session){
      res.cookie('church_directory', file.session, {
        maxAge: 4 * 60 * 60 * 1000, // 1 day
        httpOnly: true,              // can't be accessed by JS in the browser
        secure: true,               // true if using HTTPS
        sameSite: 'lax'
      });
    }
    const a = new Set();
    const items = []
    file['directory'].forEach(element => {
      if (element['status']==='ActMem'){
        items.push(element)
      }
      a.add(element['status'])
    });   
    // Send the request
    file['directory'] = items
    file['statistics']['records'] = items.length
    res.json({statistics: file.statistics, directory: file.directory})

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
  
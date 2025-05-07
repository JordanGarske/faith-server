import {storage } from "./config/firebase.js";
import { get, ref as dbRef } from "firebase/database";
import { db } from "./config/firebase.js";
import  {ref as storageRef, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import cron from 'node-cron'; 
import https from 'https';
import {app} from './app.js'

export async function getCalendarEvent(){
    try {
        const userRef = dbRef(db, 'dates/');
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dates = Object.keys(data).map(key => ({
              ...data[key],
              id: key,
              image: key.image ?  req.app.locals.photo[data[key].image]: null 
          }));
          app.locals.calendarEvents = dates;
        }

    } catch (error) {
        console.error("Error fetching calendar data:", error);
    }
}
//photos
export async function photos() {
  try {
    const listResult = await listAll(storageRef(storage, 'calendar-images/'));
    const key = {}
    const items = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        key[itemRef.name] = url
        return { name: itemRef.name, url: url };
      })
    );
    app.locals.photo = key;
  } catch (err) {
    console.error("Error listing files", err);
  }
}

export async function newsLetterUrl() {
  const months = getLastFiveMonths();

  try {
    await Promise.all(months.map(async (folder) => {
      const listResult = await listAll(storageRef(storage, `newletter-images/${folder}`));
      const newsList = new Array(listResult.items.length);

      await Promise.all(
        listResult.items.map(async (itemRef) => {
          const [url, metadata] = await Promise.all([
            getDownloadURL(itemRef),
            getMetadata(itemRef),
          ]);

          const pageIndex = metadata.customMetadata?.page;
          if (pageIndex !== undefined) {
            newsList[pageIndex - 1] = url;
          }
        })
      );
      app.locals.newsList[folder] = newsList;
    }));
  } catch (err) {
    console.error("Error listing newsletter images", err);
  }
}
export async function newsLetterPdfUrl() {
  const months = getLastFiveMonths();

  try {
      const listResult = await listAll(storageRef(storage, `newsletters`));
      const newsList = new Array(listResult.items.length);

      await Promise.all(
        listResult.items.map(async (itemRef) => {
          const [url, metadata] = await Promise.all([
            getDownloadURL(itemRef),
            getMetadata(itemRef),
          ]);
          console.log(url, metadata.customMetadata?.uploadedAt);
          const pageIndex = new Date((metadata.customMetadata?.uploadedAt));
          if (pageIndex !== undefined) {
            app.locals.pdfList[pageIndex.getMonth() - 1] = url;
          }
        })
      );
      console.log(   app.locals.pdfList)
  } catch (err) {
    console.error("Error listing newsletter images", err);
  }
}
function getLastFiveMonths() {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setMonth(currentDate.getMonth() - i);
    months.push(pastDate.getMonth());
  }

  return months;
}

cron.schedule('*/15 * * * *', async () => {
  try {
    await photos();
    await getCalendarEvent();
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
cron.schedule('0 */24 * * *', async () => {
  try {
    await newsLetterUrl();
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
cron.schedule('*/59 * * * *', async () => {
  try {
    youtubeVideos();
  } catch (err) {
    console.error("Cron job error:", err);
  }
});

export async function youtubeVideos() {
  const key = process.env.YOUTUBE_API_KEY; 
  const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=UUeFeHIXcJtbpw9AHLUFJ-xg&key=${key}`;

  const res = await fetch(url);
  const data = await res.json();

  const promises = data.items.map(async (element) => {
    const detailUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${element.snippet.resourceId.videoId}&key=${key}`;
    const detailRes = await fetch(detailUrl);
    const info = await detailRes.json();
    const video = info.items[0];

    const minutes = parseYoutubeDuration(video.contentDetails.duration);

    if (video.snippet.liveBroadcastContent !== 'none' || minutes > 20) {
      return {
        date: new Date(element.snippet.publishedAt),
        id: element.snippet.resourceId.videoId,
        url: element.snippet.thumbnails.maxres.url,
        title: element.snippet.title
      };
    }

    return null;
  });

  const results = await Promise.all(promises);
  const videos = results.filter(v => v !== null);

  videos.sort((a, b) => b.date - a.date);
  app.locals.youtube = videos;
}


function parseYoutubeDuration(durationString) {
  let duration = { hours: 0, minutes: 0, seconds: 0 };
  const durationParts = durationString.replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "").split(":");

  if (durationParts.length === 3) {
    duration.hours = parseInt(durationParts[0], 10);
    duration.minutes = parseInt(durationParts[1], 10);
    duration.seconds = parseInt(durationParts[2], 10);
  } else if (durationParts.length === 2) {
    duration.minutes = parseInt(durationParts[0], 10);
    duration.seconds = parseInt(durationParts[1], 10);
  } else if (durationParts.length === 1) {
    duration.seconds = parseInt(durationParts[0], 10);
  }

  return duration.hours * 60 + duration.minutes
}

// Example usage:

// cron.schedule('*/14 * * * *', () => {
//   https.get('https://faith-server.onrender.com', (res) => {
//     if (res.statusCode === 200) {
//       console.log('Server pinged successfully');
//     } else {
//       console.log(`Server ping failed with status code: ${res.statusCode}`);
//     }
//   }).on('error', (err) => {
//     console.error('Ping failed:', err);
//   });
// });
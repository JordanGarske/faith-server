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
  try {
    const listResult = await listAll(storageRef(storage, 'newletter-images/'));
    const newsList = new Array(listResult.items.length);

    const items = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const [url, metadata] = await Promise.all([
          getDownloadURL(itemRef),
          getMetadata(itemRef),
        ]);

        const pageIndex = metadata.customMetadata?.page;
        if (pageIndex !== undefined) {
          newsList[pageIndex-1] = url;
        }

        return { name: itemRef.name, url };
      })
    );

    app.locals.newsList = newsList;
  } catch (err) {
    console.error("Error listing newsletter images", err);
  }
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
import {storage } from "./config/firebase.js";
import { get, ref as dbRef } from "firebase/database";
import { db } from "./config/firebase.js";
import  {ref as  storageRef, getDownloadURL,listAll } from "firebase/storage";
import cron from 'node-cron'; 
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
        // res.status(500).json({ error: "Failed to fetch calendar data" });
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
cron.schedule('*/15 * * * *', async () => {
  try {
    await photos();
    await getCalendarEvent();
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
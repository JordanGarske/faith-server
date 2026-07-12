import { get, ref as dbRef,remove, push, set, } from "firebase/database";
import {db,storage} from "./config/firebase.js";
// app.get("/admin/get/:folder", checkLogin, async(req, res)=>{
//     try {
//         const userRef = dbRef(db, `${req.params.folder}`);
//         const snapshot = await get(userRef);
        
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           const dates = Object.keys(data).map(key => ({
//               ...data[key],
//               id: key,
//               image: key.image ?  req.app.locals.photo[data[key].image]: null 
//           }));
//           return dates;
//         }

//     } catch (error) {
//         console.error("Error fetching calendar data:", error);
//     }
// })
// --- LOGIN ROUTE ---
export async function login (req, res) {
  console.log('login');
  const { Username, Password } = req.body;
  console.log(Username);
  console.log(process.env.USER_NAME);
  // safely parse the cookie if present
  let cookieData = null;
  console.log(req.cookies);
  if (req.cookies && req.cookies.login) {
    try {
      cookieData = typeof req.cookies.login === "string"
        ? JSON.parse(req.cookies.login)
        : req.cookies.login;
    } catch {
      cookieData = null;
    }
  }

  // already logged in?
  if (cookieData === true) {
    console.log('Login already established');
    return res.status(200).json({ session: true });
  }

  // check credentials
  if (Username === process.env.USER_NAME && Password === process.env.PASSWORD) {
    console.log('Login successful');
    res.cookie(
      "login",
      "true",
      {
        maxAge: 4 * 60 * 60 * 1000, // 4 hours
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      }
    );
    return res.status(200).json({ session: true });
  }

  // invalid credentials
  return res.status(401).json({ session: false, message: "Invalid credentials" });
};

export function checkLogin(req, res, next) {
  try {
    let loginData = null;
    console.log(req.cookies);
    if (req.cookies?.login === 'true') {
      return next();
    }

  } catch (err) {
    console.error("Error parsing login cookie:", err);
  }

  res.status(401).json({ error: "check login Unauthorized" });
}

export async function getFolderData(req, res) {
  try {
    const userRef = dbRef(db, req.params.folder);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

      const dates = Object.keys(data).map((key) => ({
        ...data[key],
        id: key,
        // image: data[key].image
        //   ? req.app.locals.photo[data[key].image]
        //   : null,
      }));

      return res.json(dates);
    }

    return res.json([]);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};
export async function addToFireBase(req, res) {
  try {
    let snapshot;
    if(req.body.data.id){
      snapshot = set(dbRef(db, req.body.folder+req.body.data.id ), req.body.data)
    }
    else{
      snapshot = push(dbRef(db, req.body.folder ), req.body.data)
    }

    res.json(snapshot);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
}
export async function deleteFromFireBase(req, res) {
  try {
    const userRef = dbRef(db, req.body.folder + req.body.id); 
    console.log(req.body.folder + req.body.id);
    const snapshot = await remove(userRef);
    res.json(snapshot);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
}

import app from './app.js'
import connectionTODb from './config/db.js';
import { v2 as cloudinary } from "cloudinary";



cloudinary.config({
  cloud_name: "dlrud73rg",
  api_key: "929424498164355",
  api_secret: "EN6vGWGpNyEs6pqBa4sP3k2L1RY",
});



const PORT = process.env.PORT || 3001; //  Heroku will provide this environment variable for you if not provided by the user
app.listen(PORT, async () => {
   await connectionTODb();  // first connect to DB  and then start the server
  console.log(`server listen at port ${PORT}`);
});

import  cookieParser from "cookie-parser";
import cors from "cors";
import  express from "express";
import morgan from "morgan";
import router from "./routes/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express(); // creating an instance of the express server.
app.use(morgan(("dev")));// logging requests to the console in a human readable format.

app.use(express.json()); //  for parsing application/json
app.use(
  cors({
    origin: [process.env.FROTEND_URL], //  allow to run on localhost:3000
    credentials: true, //   allows to include cookies in requests
  })
); // to enable cross-origin resource sharing (CORS) so that web applications can make requests across domain boundaries.

app.use(cookieParser()); //  middleware for parsing cookies

app.use("/ping", (req, res) => {
  //  route handler for /ping
  res.send("Server Start");
});
// routes of 3 module;
app.use('/api/v1/user',router) //   user router




app.all("*", (req, res) => {
  //  404 error handling middleware
  return res.status(404).json({ message: "Not Found" });
});

app.use(errorMiddleware);

//module.exports=app;
export default  app;



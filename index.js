const express = require("express");
const { dbConnect } = require("./config/database");
const router = require("./routes/userRoutes");
const cors = require("cors");
const { connectToCloudinary } = require("./config/connectToCloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const Port = process.env.PORT || 5000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true
  })
);
app.use("/api/v1", router);
dbConnect(process.env.MONGODB_URL);
connectToCloudinary(
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

app.get("/", (req, res) => {
  res.send("<h1>namaste duniya</h1>");
});

app.listen(Port, () => {
  console.log(`app listening on ${Port}`);
});

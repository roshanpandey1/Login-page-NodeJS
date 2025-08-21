 
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const app = express();

// Set view engine
app.set("view engine", "ejs");

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dcvxudtln",
  api_key: "686578999543284",
  api_secret: "qlbHJDj34ZK7dSI4uZd5T1EetnQ",
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/", {
    dbName: "Nodejs_Master_Course",
  })
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("login.ejs", { url: null });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { url: null });
});

// Multer storage setup
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// Register route (with file upload to Cloudinary)
app.post("/register", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded!");
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Render register page with uploaded image URL
    res.render("register.ejs", { url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("File upload failed");
  }
});

// Start server
const PORT = 9000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

function handleError(err, req, res, next) {
  console.error("Error occurred:", err);
  res.status(500).send("Internal Server Error");
}

function notFound(req, res, next) {
  res.status(404).send("Not Found");
}

import dotenv from "dotenv";
import express from "express";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
dotenv.config();


// Uploading Files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/src/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname);
    }
});

const upload = multer({ storage: storage });


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
});
app.use("/api/posts",postRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);


app.listen(8800,()=>{
    console.log("Server has been Started");
})
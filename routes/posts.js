import express from "express";
import { addPost,getPost,getPosts,deletePost,updatePost } from "../controller/post.js";

const router = express.Router();

// Get all Posts
router.get("/",getPosts);
router.get("/:id",getPost);
router.post("/",addPost);
router.delete("/:id",deletePost);
router.put("/:id",updatePost);

export default router;
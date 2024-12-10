import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controller/PostsController.js";
import { predictWeather } from '../controller/ResultController.js';

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.patch("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);
router.post('/result', predictWeather);

export default router;

import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet);
router.route("/user/:userId").get(optionalAuth, getUserTweets); // Public with optional auth for isLikedByMe
router.route("/:tweetId").patch(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet);

export default router;

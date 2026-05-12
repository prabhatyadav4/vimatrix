import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  //TODO: create tweet
  // Step 1: Validate content
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required.");
  }

  if (content.trim().length > 280) {
    throw new ApiError(400, "Tweet cannot exceed 280 characters.");
  }

  // Step 2: Create the tweet
  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Failed to create tweet. Please try again.");
  }

  // Step 3: Send response
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet Created Successfully."));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // TODO: get user tweets
  // Step 1: Validate userId
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID.");
  }

  // Step 2: Check the user exists
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  // Step 3: Aggregate tweets with owner info and like count
  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }],
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        likesCount: { $size: "$likes" },
        isLikedByMe: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  // Step 4: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User Tweets Fetched Successfully."));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  //TODO: update tweet
  // Step 1: Validate tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID.");
  }

  // Step 2: Validate content
  if (!content?.trim()) {
    throw new ApiError(400, "Updated tweet content is required.");
  }

  if (content.trim().length > 280) {
    throw new ApiError(400, "Tweet cannot exceed 280 characters.");
  }

  // Step 3: Find tweet and verify ownership
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found.");

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this tweet.");
  }

  // Step 4: Apply update
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content: content.trim() } },
    { new: true }
  );

  // Step 5: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet Updated Successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: delete tweet
  // Step 1: Validate tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID.");
  }

  // Step 2: Find tweet and verify ownership
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found.");

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet.");
  }

  // Step 3: Delete the tweet
  await Tweet.findByIdAndDelete(tweetId);

  // Step 4: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet Deleted Successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

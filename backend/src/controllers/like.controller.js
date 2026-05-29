import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Reusable toggle helper
const toggleLike = async (filterQuery) => {
  const existingLike = await Like.findOne(filterQuery);

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return { liked: false };
  }

  await Like.create(filterQuery);
  return { liked: true };
};

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  const result = await toggleLike({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.liked
          ? "Video Liked Successfully."
          : "Video Unliked Successfully."
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID.");
  }

  const result = await toggleLike({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.liked
          ? "Comment Liked Successfully."
          : "comment Unliked Successfully."
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID.");
  }

  const result = await toggleLike({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.liked
          ? "Tweet Liked Successfully."
          : "Tweet Unliked Successfully."
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }],
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              createdAt: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$video" },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 0,
        video: 1,
      },
    },
  ]);

  const videos = likedVideos.map((entry) => entry.video);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked Videos Fetched Successfully."));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const channelId = req.user._id;

  // Step 1: Total Subsribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // Step 2: Total Videos & Aggregate Views/Likes in one pipeline
  const VideoStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$videoLikes" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalVidoes: 1,
        totalViews: 1,
        totalLikes: 1,
      },
    },
  ]);

  const {
    totalVideos = 0,
    totalViews = 0,
    totalLikes = 0,
  } = videoStats[0] || {};

  // Step 3: Shape the final stats object
  const stats = {
    totalSubscribers,
    totalVideos,
    totalViews,
    totalLikes,
  };

  // Step 4: Sending response
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel Stats Fetched Successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const channelId = req.user._id;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const sortDirection = sortType === "asc" ? 1 : -1;

  // Aggregation Pipeline
  const pipeline = Video.aggregate([
    // Step 1: Only fetch videos owned by this channel
    {
        $match: {
            owner: new mongoose.Types.ObjectId(channelId),
        }
    },

    // Step 2: Join likes to get like count per video
    {
        $lookup: {
            from: "likes",
            localField : "_id",
            foreignField : "video",
            as: "likes",
        }
    },

    // Step 3: Sort by the requested field
    {
        $sort: {
            [sortBy] : sortDirection,
        }
    },

    // Step 4: Project only fields relevant to the dashboard
    {
        $project: {
            _id: 1,
            thumbnail: 1,
            title: 1,
            description: 1,
            duration: 1, 
            views: 1,
            isPublished: 1,
            createdAt: 1,
            likesCount: { $size: "$likes"}
        }
    }
  ]);

  // Paginate
  const options = {page: pageNumber, limit: limitNumber};
  const result = await Video.aggregatePaginate(pipeline, options);

  // Send response
  return res
    .status(200)
    .json(
        new ApiResponse(200, result, "Channel Videos Fetched Successfully.")
    )
});

export { getChannelStats, getChannelVideos };

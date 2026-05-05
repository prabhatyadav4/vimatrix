import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination

  // Step 1: Extract query parameters from request
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  // Step 2: Convert page and limit to numbers
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Step 3: Determine sort direction (1 = ascending, -1 = descending)
  const sortDirection = sortType === "asc" ? 1 : -1;

  // Step 4: Build filter condition
  // If query exists, search in title (case-insensitive)
  const matchStage = query ? { title: { $regex: query, $options: "i" } } : {};

  // Step 5: Build sorting object dynamically
  const sortStage = {
    [sortBy]: sortDirection,
  };

  // Step 6: Define aggregation pipeline
  const aggregatePipeline = [
    // Filter videos based on search condition
    { $match: matchStage },

    // Sort videos based on given field and direction
    { $sort: sortStage },

    // Join user data (similar to populate)
    {
      $lookup: {
        from: "users", // collection name
        localField: "owner", // field in video collection
        foreignField: "_id", // field in user collection
        as: "channel", // output field
      },
    },

    // Convert channel array into single object
    { $unwind: "$channel" },

    // Select and format required fields
    {
      $project: {
        _id: 1,
        thumbnail: 1,
        title: 1,
        duration: 1,
        isPublished: 1,
        createdAt: 1,
        updatedAt: 1,

        // Handle views field safely
        views: {
          $cond: {
            if: { $isArray: "$views" },
            then: { $size: "$views" },
            else: { $ifNull: ["$views", 0] },
          },
        },

        // Include selected user fields
        "channel._id": 1,
        "channel.username": 1,
        "channel.avatar": 1,
      },
    },
  ];

  // Step 7: Pagination options
  const options = {
    page: pageNumber,
    limit: limitNumber,
  };

  // Step 8: Create aggregation instance
  const aggregate = Video.aggregate(aggregatePipeline);

  // Step 9: Apply pagination
  const result = await Video.aggregatePaginate(aggregate, options);

  // Step 10: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, result, "All Videos Fetched Successfully."));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

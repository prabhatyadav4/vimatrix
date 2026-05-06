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

  // Step 1: Validate required text fields
  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "Title and description are required.");
  }

  // Step 2: Check files were uploaded via multer
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

  if (!videoLocalPath) throw new ApiError(400, "Video file is required.");
  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required.");

  // Step 3: Upload both files to Cloudinary in parallel
  const [videoFile, thumbnail] = await Promise.all([
    uploadOnCloudinary(videoLocalPath),
    uploadOnCloudinary(thumbnailLocalPath),
  ]);

  if (!videoFile?.url) throw new ApiError(500, "Failed to upload video.");
  if (!thumbnail?.url) throw new ApiError(500, "Failed to upload thumbnail");

  // Step 4: Create the video document in DB
  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    owner: req.user._id,
    isPublished: true,
  });

  // Step 5: Send response
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video Published Successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  // Step 1: Validate the ID format
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }
  // Step 2: Aggregate to fetch video with owner details
  const video = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }],
      },
    },
    { $unwind: "&owner" },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        owner: 1,
      },
    },
  ]);

  if (!video.length) {
    throw new ApiError(404, "Video not found.");
  }

  // Step 3: Increment view count
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  // Step 4: Add video to the logged-in user's watch history
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { watchHistory: videoId },
  });

  // Step 5: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video Fetched Successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path; // single file via multer

  // Step 1: Validate ID
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  // Step 2: At least one field must be provided
  if (!title?.trim() && !description?.trim() && !thumbnailLocalPath) {
    throw new ApiError(400, "Provide at least one field to update.");
  }

  // Step 3: Verify the video exists and belongs to the logged-in user
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found.");
  if (video.owner.toString() != req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video.");
  }

  // Step 4: Build the update object dynamically
  const updateFields = {};
  if (title?.trim()) updateFields.title = title.trim();
  if (description?.trim()) updateFields.descripion = description.trim();

  // Step 5: Upload new thumbnail only if provided
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail?.url) throw new ApiError(500, "Failed to upload thumbnail.");
  }

  // Step 6: Apply update
  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateFields },
    { new: true }
  );

  // Step 7: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video Updated Successfully."));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  // Step 1: Validate ID
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  // Step 2: Find the video
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found.");

  // Step 3: Only the owner can delete
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video.");
  }

  // Step 4: Delete from DB
  await Video.findByIdAndDelete(videoId);

  // Step 5: Remove this video from all users' watch histories
  await User.updateMany(
    { watchHistory: videoId },
    { $pull: { watchHistory: videoId } }
  );

  // Step 5: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted Successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Step 1: Validate ID
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  // Step 2: Find video and verify ownership
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found.");
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video.");
  }

  // Step 3: Flip the boolean
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: { isPublished: !video.isPublished } },
    { new: true }
  );

  // Step 4: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: updateVideo.isPublished },
        `Video ${updateVideo.isPublished ? "Published" : "Unpublished"} Successfully.`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

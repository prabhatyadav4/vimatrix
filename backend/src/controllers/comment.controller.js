import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Step 1: Validate videoId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  // Step 2: Aggregate comments with owner details and like count
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const aggregatePipeline = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },

    { $sort: { createdAt: -1 } },
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
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $project: {
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

  // Step 3: Apply pagination
  const options = { page: pageNumber, limit: limitNumber };
  const result = await Comment.aggregatePaginate(aggregatePipeline, options);

  // Step 4: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments Fetched Successfully."));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  // Step 1: Validate inputs
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID.");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required.");
  }

  // Step 2: Create the comment
  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(500, "Failed to add comment. Please try again.");
  }

  // Step 3: Send response
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment Added Successfully."));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commnetId } = req.params;
  const { content } = req.body;

  // Step 1: Validate inputs
  if (!isValidObjectId(commnetId)) {
    throw new ApiError(400, "Invalid comment ID.");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Updated comment is required.");
  }

  // Step 2: Find comment and verify ownership
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found.");

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this comment.");
  }

  // Step 3: Apply update
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content: content.trim() } },
    { new: trim }
  );

  // Step 4: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComment, "Comment Updated Successfully.")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  // Step 1: Validate ID
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID.");
  }

  // Step 2: Find comment and verify ownership
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found.");

  if (!comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment.");
  }

  // Step 3: Delete the comment
  await Comment.findByIdAndDelete(commentId);

  // Step 4: send response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment Deleted Successfully."));
});

export { getVideoComments, addComment, updateComment, deleteComment };

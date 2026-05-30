import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist

  // Step 1: Validate fields
  if (!name?.trim()) throw new ApiError(400, "Playlist name is required.");
  if (!description?.trim())
    throw new ApiError(400, "Playlist description is required.");

  // Step 2: Create the playlist
  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
    videos: [],
  });

  if (!playlist)
    throw new ApiError(500, "Failed to create playlist. Please try again.");

  // Step 3: Send response
  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist Created Successfully."));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  // Step 1: Validate userId
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID.");

  // Step 2: Fetch all playlists with video thumbnails and count
  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 1,
              thumbnail: 1,
              title: 1,
              duration: 1,
            },
          },
        ],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        videosCount: { $size: "$videos" },
        coverThumbnail: { $first: "$videos.thumbnail" },
        videos: 1,
      },
    },
  ]);

  // Step 3: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User Playlists Fetched Successfully.")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  // Step 1: Validate playlistId
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID.");

  // Step 2: Fetch playlist with full video and owner details
  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    // Lookup videos with their details
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                { $project: { username: 1, avatar: 1, fullName: 1 } },
              ],
            },
          },
          { $unwind: "$owner" },
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
    // Lookup playlist owner
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
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        videos: 1,
        videosCount: { $size: "$videos" },
        totalViews: { $sum: "$videos.views" },
      },
    },
  ]);

  if (!playlist.length) throw new ApiError(404, "Playlist not found.");

  // Step 3: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, playlist[0], "Playlist Fetched Successfully."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  // Step 1: Validate IDs
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID.");
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID.");

  // Step 2: Find playlist and verify ownership
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify the playlist.");
  }

  // Step 3: Guard against duplicate entries
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(409, "Video is already in the playlist.");
  }

  // Step 4: Push video into the array
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { videos: videoId } },
    { new: true }
  );

  // Step 5: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video Added to Playlist Successfully."
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  // Step 1: Validate IDs
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID.");
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID.");

  // Step 2: Find playlist and verify ownership
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found.");
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist.");
  }

  // Step 3: Confirm video actually exists in the playlist
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(404, "Video not found in this playlist");
  }

  // Step 4: Pull video out of the array
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: new mongoose.Types.ObjectId(videoId) } },
    { new: true }
  );

  // Step 5: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video Removed from Playlist Successfully."
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  // Step 1: Validate ID
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID.");

  // Step 2: Find playlist and verify ownership
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found.");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist.");
  }

  // Step 3: Delete the playlist
  await Playlist.findByIdAndDelete(playlistId);

  // Step 4: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist Deleted Successfully."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  // Step 1: Validate ID
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist ID.");

  // Step 2: At least one field must be provided
  if (!name?.trim() && !description?.trim()) {
    throw new ApiError(400, "Provide at least one field to update.");
  }

  // Step 3: Find playlist and verify ownership
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update the playlist.");
  }

  // Step 4: Build update object with only provided fields
  const updateFields = {};
  if (name?.trim()) updateFields.name = name.trim();
  if (description?.trim()) updateFields.description = description.trim();

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: updateFields },
    { new: true }
  );

  // Step 5: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist Updated Successfully.")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};

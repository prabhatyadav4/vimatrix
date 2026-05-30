import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  // Step 1: Validate Channel ID
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID.");
  }

  // Step 2: Prevent self-subscription
  if (channelId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel.");
  }

  // Step 3: Check if the channel (user) actually exists
  const channelExists = await User.findById(channelId);
  if (!channelExists) throw new ApiError(404, "Channel not found.");

  // Step 4: Check if the subscription already exists
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  // Step 5: Toggle - remove if exists, create if not and send response
  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscribed: false },
          "Unsubscribed Successfully."
        )
      );
  }

  await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { subscribed: true }, "Subscribed Successfully.")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Step 1: Validate channelId
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID.");
  }

  // Step 2: Aggregate subscribers with their profile details
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }],
      },
    },
    { $unwind: "$subscriber" },
    {
      $lookup: {
        from: "subscriptions",
        let: { subscriberId: "$subscriber._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$subscriber",
                      new mongoose.Types.ObjectId(channelId),
                    ],
                  },
                  { $eq: ["$channel", "$$subscriberId"] },
                ],
              },
            },
          },
        ],
        as: "mutualSubscription",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 0,
        subscribedAt: "$createdAt",
        subscriber: 1,
        isSubscribedBack: {
          $cond: {
            if: { $gt: [{ $size: "$mutualSubscription" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  // Step 3: Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribersCount: subscribers.length, subscribers },
        "Subscribers Fetched Successfully."
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // Step 1: Validate susbcriberId
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID.");
  }

  // Step 2: Aggregate channels with latest video info
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }],
      },
    },
    { $unwind: "$channel" },
    {
      $lookup: {
        from: "videos",
        let: { channelId: "$channel._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$owner", "$$channelId"] },
                  { $eq: ["$isPublished", true] },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          { $project: { title: 1, thumbnail: 1, createdAt: 1, views: 1 } },
        ],
        as: "latestVideo",
      },
    },
    {
      $project: {
        _id: 0,
        subsribedAt: "$createdAt",
        channel: 1,
        latestVideo: { $first: "$latestVideo" },
      },
    },
  ]);

  // Step 3: Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribedChannelsCount: subscribedChannels.length,
        subscribedChannels,
      },
      "Subscribed Channels Fetched Successfully."
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

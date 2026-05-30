import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Optional authentication middleware
// If a valid token is present → attaches req.user
// If no token or invalid token → continues without req.user (no error thrown)
// Use this for routes that work for both guests and logged-in users
// (e.g., channel profile shows isSubscribed only when logged in)

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // No token → continue as guest
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Token is invalid or expired — continue as guest, don't crash
    // The user will just see the public version of the page
  }

  next();
};

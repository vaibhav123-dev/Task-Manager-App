import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req?.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("isAdmin email");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
};

const isAdminRoute = (req, res, next) => {
  if (req?.user && req?.user?.isAdmin) {
    next();
  } else {
    throw new ApiError(401, error?.message || "Not authorized as admin. Try login as admin.");
  }
};

export { isAdminRoute, verifyJWT };

import User from "../models/user.js";
import Notice from "../models/notification.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const token = await user.generateAccessToken();

    return token;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, role, title, isActive } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new ApiError(400, "User already exits");
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
      title,
      isActive,
    });

    if (user) {
      let token;

      if (isAdmin) {
        token = await generateAccessAndRefreshToken(user._id);
      } else {
        token = null;
      }

      delete user.password;
      user.token = token;

      res
        .status(201)
        .json(new ApiResponse(201, { user: user, token }, "User registered successfully"));
    } else {
      throw new ApiError(400, "Invalid user");
    }
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while registering user");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(402, "Invalid email or password");
    }

    if (!user?.isActive) {
      throw new ApiError(401, "User account has been deactivated, contact the administrator");
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Password incorrect");
    }

    if (user) {
      let token;

      token = await generateAccessAndRefreshToken(user._id);

      delete user.password;

      user.token = token;

      res.status(201).json(
        new ApiResponse(
          201,
          {
            user: user,
            token,
          },
          "User registered successfully"
        )
      );
    } else {
      throw new ApiError(401, "Invalid email or password");
    }
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while login user");
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.status(201).json(new ApiResponse(201, {}, "Logout successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while logout user");
  }
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name title role email isActive isAdmin");
    res.status(201).json(new ApiResponse(201, users, "User fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while logout user");
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { _id } = req.user;

    const notice = await Notice.find({
      team: _id,
      isRead: { $nin: [_id] },
    }).populate("task", "title");

    res.status(201).json(new ApiResponse(200, notice, "Notifications fetch successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while fetching notifications");
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { _id } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: _id, isRead: { $nin: [_id] } },
        { $push: { isRead: _id } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [_id] } },
        { $push: { isRead: _id } },
        { new: true }
      );
    }

    res.status(201).json(new ApiResponse(200, {}, "Notifications read successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while reading notifications");
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, isAdmin, role, title, isActive } = req.body;

    // Find the user by ID
    let user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email is being updated, and if the new email is already in use by another user
    if (email && email !== user.email) {
      const userExist = await User.findOne({ email });
      if (userExist) {
        throw new ApiError(400, "Email is already taken");
      }
      user.email = email;
    }

    if (req?.file?.path) {
      const avatarLocalPath = req.file.path;

      // Upload avatar to Cloudinary
      const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

      if (uploadedAvatar && uploadedAvatar.url) {
        user.avatar = uploadedAvatar.url; // Set the uploaded avatar URL
      } else {
        throw new ApiError(400, "Failed to upload avatar");
      }
    }

    // Update user fields (only if provided in the request body)
    if (name) user.name = name;
    if (password) user.password = password; // Ensure password is hashed in User model hooks
    if (role) user.role = role;
    if (title) user.title = title;

    // Save the updated user
    await user.save();

    // Remove password from the response
    user = user.toObject();
    delete user.password;

    res.status(200).json(new ApiResponse(200, { user }, "User updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while updating profile");
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password chnaged successfully.`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json(new ApiResponse(200, {}, "User Delete Successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while deleting user");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, isAdmin, role, title, isActive } = req.body;

    // Find the user by ID
    let user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email is being updated, and if the new email is already in use by another user
    if (email && email !== user.email) {
      const userExist = await User.findOne({ email });
      if (userExist) {
        throw new ApiError(400, "Email is already taken");
      }
      user.email = email;
    }

    // Update user fields (only if provided in the request body)
    if (name) user.name = name;
    if (password) user.password = password; // Ensure password is hashed in User model hooks
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;
    if (role) user.role = role;
    if (title) user.title = title;
    if (typeof isActive === "boolean") user.isActive = isActive;

    // Save the updated user
    await user.save();

    // Remove password from the response
    user = user.toObject();
    delete user.password;

    res.status(200).json(new ApiResponse(200, { user }, "User updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while updating user");
  }
};

export const registerAdmin = async (adminUserData) => {
  const { name, title, role, email, password, isAdmin, isActive } = adminUserData;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const admin = await User.create({
      name,
      title,
      role,
      email,
      password,
      isAdmin,
      isActive,
    });
    return new ApiResponse(200, admin, "Admin registered successfully");
  }
  return;
};

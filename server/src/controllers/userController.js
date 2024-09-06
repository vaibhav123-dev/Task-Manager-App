import User from "../models/user.js";
import Notice from "../models/notification.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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
    const users = await User.find().select("name title role email isActive");
    res.status(201).json(new ApiResponse(201, users, "User fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while logout user");
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notice.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json(notice);
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id = isAdmin && userId === _id ? userId : isAdmin && userId !== _id ? _id : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
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

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${user?.isActive ? "activated" : "disabled"}`,
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

    res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
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
};

import express from "express";
import { isAdminRoute, verifyJWT } from "../middlewares/authMiddlewave.js";
import {
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

router.route("/get-team").get(verifyJWT, isAdminRoute, getTeamList);
router.route("/notifications").get(verifyJWT, getNotificationsList);

router.route("/read-notifications").put(verifyJWT, markNotificationRead);
router.route("/profile/:id").put(verifyJWT, upload.single("avatar"), updateUserProfile);
router.route("/change-password").put(verifyJWT, changeUserPassword);

// ADMIN ONLY - ADMIN ROUTES
router.route("/:id").delete(verifyJWT, isAdminRoute, deleteUserProfile);
router.route("/updateUser/:id").put(verifyJWT, isAdminRoute, updateUser);

export default router;

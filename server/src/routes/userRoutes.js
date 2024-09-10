import express from "express";
import { isAdminRoute, verifyJWT } from "../middlewares/authMiddlewave.js";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
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
router.route("/profile").put(verifyJWT, updateUserProfile);
router.route("/change-password").put(verifyJWT, changeUserPassword);

// ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(verifyJWT, isAdminRoute, activateUserProfile)
  .delete(verifyJWT, isAdminRoute, deleteUserProfile);

export default router;

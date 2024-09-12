import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { registerAdmin } from "./controllers/userController.js";
import { adminUserData } from "./constants.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(async () => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDb connection failed", error);
  });

registerAdmin(adminUserData);

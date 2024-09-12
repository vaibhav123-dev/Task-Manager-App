import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { registerAdmin } from "./controllers/userController.js";
import { adminUserData } from "./constants.js";

dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDb connection failed", error);
  });

registerAdmin(adminUserData);

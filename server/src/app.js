import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

app.use(
  cors({
    origin: "https://task-manager-app-1-pxhf.onrender.com",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "production") {
  // Set static folder to client/build
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Serve index.html for any other route that doesn't match your API
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

app.use(express.static("public"));

app.use(cookieParser());

//routes declarations
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

export { app };

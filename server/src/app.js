import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";

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

if (process.env.NODE_ENV === "production") {
  const path = require("path");

  // Set static folder
  app.use(express.static("client/build"));

  // Serve index.html for any routes that don't match your API
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(express.static("public"));

app.use(cookieParser());

//routes declarations
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

export { app };

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8000",
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

app.use(express.static("public"));

app.use(cookieParser());

//routes declarations
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

export { app };

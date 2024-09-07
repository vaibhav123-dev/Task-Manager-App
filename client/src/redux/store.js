import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import teamReducer from "./slices/teamSlice.js";
import taskReducer from "./slices/taskSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
    tasks: taskReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import teamReducer from "./slices/teamSlice.js";
import taskReducer from "./slices/taskSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
    tasks: taskReducer,
    dashboard: dashboardReducer,
  },
});

export default store;

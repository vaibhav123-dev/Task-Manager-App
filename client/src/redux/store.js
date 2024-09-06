import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import teamReducer from "./slices/teamSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
  },
});

export default store;

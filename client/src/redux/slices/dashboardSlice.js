import { createSlice } from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: {
      tasks: {
        todo: 0,
        "in progress": 0,
        completed: 0,
      },
    },
  },
  reducers: {
    setData: (state, action) => {
      state.dashboard = action.payload;
    },
  },
});

export const { setData } = dashboardSlice.actions;

export default dashboardSlice.reducer;

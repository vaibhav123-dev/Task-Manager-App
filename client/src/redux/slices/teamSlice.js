import { createSlice } from "@reduxjs/toolkit";

export const teamSlice = createSlice({
  name: "team",
  initialState: {
    team: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.team = action.payload;
    },
  },
});

export const { setUsers } = teamSlice.actions;

export default teamSlice.reducer;

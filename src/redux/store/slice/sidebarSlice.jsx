import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    selectedSubItem: null,
  },
  reducers: {
    setSelectedSubItem: (state, action) => {
      state.selectedSubItem = action.payload;
    },
  },
});

export const { setSelectedSubItem } = sidebarSlice.actions;

export const selectSelectedSubItem = (state) => state.sidebar.selectedSubItem;

export default sidebarSlice.reducer;

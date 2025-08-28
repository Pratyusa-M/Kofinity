import { createSlice } from "@reduxjs/toolkit";

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    buyId: null,
    editId: null,
    realEstateName: "",
  },
  reducers: {
    setBuyId: (state, action) => {
      state.buyId = action.payload;
    },
    setEditId: (state, action) => {
      state.editId = action.payload;
    },
    setRealEstateName: (state, action) => {
      state.realEstateName = action.payload;
    },
  },
});

export const { setBuyId, setEditId, setRealEstateName } =
  portfolioSlice.actions;

export const selectedBuyId = (state) => state.portfolio.buyId;

export const selectedEditId = (state) => state.portfolio.editId;

export const selectedRealEstateName = (state) => state.portfolio.realEstateName;

export default portfolioSlice.reducer;

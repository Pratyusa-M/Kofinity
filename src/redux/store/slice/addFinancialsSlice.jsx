// addFinancialsSlice
import { createSlice } from "@reduxjs/toolkit";

const addFinancialsSlice = createSlice({
  name: "addFinancials",
  initialState: {
    addDebtFormData: {},
    debtRoute1: "",
    debtRoute2: "",
  },
  reducers: {
    setAddDebtFormData: (state, action) => {
      state.addDebtFormData = action.payload;
    },
    setDebtRoute1: (state, action) => {
      state.debtRoute1 = action.payload;
    },
    setDebtRoute2: (state, action) => {
      state.debtRoute2 = action.payload;
    },
  },
});

export const {
  setAddDebtFormData,
  setDebtRoute1,
  setDebtRoute2,
  setAddDebtDropDownData,
} = addFinancialsSlice.actions;
export const addedDebtFormData = (state) => state.addFinancials.addDebtFormData;
export const debtRoute1Value = (state) => state.addFinancials.debtRoute1;
export const debtRoute2Value = (state) => state.addFinancials.debtRoute2;
export default addFinancialsSlice.reducer;

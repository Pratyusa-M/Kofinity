/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseUrl";

const dummyCurrencyData = [
  {
    id: 21,
    type: "currency",
    subType: "currency",
    option: "USD",
    isActive: true,
  },
  {
    id: 22,
    type: "currency",
    subType: "currency",
    option: "EUR",
    isActive: true,
  },
];

export const fetchCurrencyOptionsApi = createAsyncThunk(
  "fetchCurrencyOptionsApi",
  async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      `${baseUrl}lists?subtype=currency`,
      config
    );
    return response?.data?.data;
  }
);

const currencyOptionSlice = createSlice({
  name: "currencyApi",
  initialState: {
    isLoading: false,
    data: [],
    error: false,
    apiSuccess: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencyOptionsApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCurrencyOptionsApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.apiSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(fetchCurrencyOptionsApi.rejected, (state) => {
      state.error = true;
    });
  },
});

export const currencyOptions = (state) => state.currencyApi.data;
export const apiSuccess = (state) => state.currencyApi.apiSuccess;

export default currencyOptionSlice.reducer;

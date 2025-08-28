// onboardingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: {
    currentQuestionIndex: 0,
    selectedOptions: [],
    allSelectedData: [],
    onboardingData: [],
  },
  reducers: {
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setSelectedOptions: (state, action) => {
      const { questionIndex, optionId } = action.payload;
      state.selectedOptions[questionIndex] = optionId;
    },
    resetSelectedOptions: (state) => {
      state.selectedOptions = [];
    },

    addToAllSelectedData: (state, action) => {
      const { questionId, optionId } = action.payload;
      const existingDataIndex = state.allSelectedData.findIndex(
        (data) => data.questionId === questionId
      );

      if (existingDataIndex !== -1) {
        // If data for the current question already exists
        if (state.allSelectedData[existingDataIndex].optionId !== optionId) {
          // If the selected option has changed, update the entry
          state.allSelectedData[existingDataIndex].optionId = optionId;
        }
      } else {
        // If data for the current question does not exist, add it
        state.allSelectedData.push({
          questionId,
          optionId,
        });
      }
    },
    setOnboardingData: (state, action) => {
      state.onboardingData = action.payload;
    },
  },
});

export const {
  setCurrentQuestionIndex,
  setSelectedOptions,
  resetSelectedOptions,
  addToAllSelectedData,
  setOnboardingData,
} = onboardingSlice.actions;
export const onboardingState = (state) => state.onboarding;
export default onboardingSlice.reducer;

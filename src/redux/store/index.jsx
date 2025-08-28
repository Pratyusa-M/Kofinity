import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./slice/onboardingSlice";
import SideBarReducer from "./slice/sidebarSlice";
import CurrencyReducer from "./slice/currencySlice";
import AddFinancialsReducer from "./slice/addFinancialsSlice";
import PortfolioReducer from "./slice/portfolioSlice";
import CurrencyOptionsReducer from "./slice/currencyOptionsApi";
const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    sidebar: SideBarReducer,
    currency: CurrencyReducer,
    addFinancials: AddFinancialsReducer,
    portfolio: PortfolioReducer,
    currencyApi: CurrencyOptionsReducer,
  },
});

export default store;

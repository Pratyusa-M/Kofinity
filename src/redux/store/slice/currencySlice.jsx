/* eslint-disable react-refresh/only-export-components */
import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    mainCurrency: "USD",
    mainCurrencyId: 21,
    mainCurrencySymbol: "$",
    addStocksCurrency: "USD",
    addStocksCurrencyId: 21,
    addRealEstateCurrency: "USD",
    addRealEstateCurrencyId: 21,
    addBankCurrency: "USD",
    addBankCurrencyId: 21,
    addOtherAssetCurrency: "USD",
    addOtherAssetCurrencyId: 21,
    editStockCurrency: "USD",
    editStockCurrencyId: 21,
    sellStockCurrency: "USD",
    sellStockCurrencyId: 21,
    buyStockCurrency: "USD",
    buyStockCurrencyId: 21,
    editRealEstateCurrency: "USD",
    editRealEstateCurrencyId: 21,
    sellRealEstateCurrency: "USD",
    sellRealEstateCurrencyId: 21,
    editBankCurrency: "USD",
    editBankCurrencyId: 21,
    editOtherAssetCurrency: "USD",
    editOtherAssetCurrencyId: 21,
    sellOtherAssetCurrency: "USD",
    sellOtherAssetCurrencyId: 21,
    addDebtCurrency: "USD",
    addDebtCurrencyId: 21,
    addExpenseCurrency: "USD",
    addExpenseCurrencyId: 21,
    addIncomeCurrency: "USD",
    addIncomeCurrencyId: 21,
    bankClosureCurrency: "USD",
    bankClosureCurrencyId: 21,
    addCryptoCurrency: "USD",
    addCryptoCurrencyId: 21,
    buyCryptoCurrency: "USD",
    buyCryptoCurrencyId: 21,
    sellCryptoCurrency: "USD",
    sellCryptoCurrencyId: 21,
    editCryptoCurrency: "USD",
    editCryptoCurrencyId: 21,
    marketValueCurrency: "USD",
    marketValueCurrencyId: 21,
  },
  reducers: {
    setMainCurrency: (state, action) => {
      state.mainCurrency = action.payload;
    },
    setMainCurrencyId: (state, action) => {
      state.mainCurrencyId = action.payload;
    },
    setMainCurrencySymbol: (state, action) => {
      state.mainCurrencySymbol = action.payload;
    },
    setAddStocksCurrency: (state, action) => {
      state.addStocksCurrency = action.payload;
    },
    setAddStocksCurrencyId: (state, action) => {
      state.addStocksCurrencyId = action.payload;
    },
    setAddRealEstateCurrency: (state, action) => {
      state.addRealEstateCurrency = action.payload;
    },
    setAddRealEstateCurrencyId: (state, action) => {
      state.addRealEstateCurrencyId = action.payload;
    },
    setAddBankCurrency: (state, action) => {
      state.addBankCurrency = action.payload;
    },
    setAddBankCurrencyId: (state, action) => {
      state.addBankCurrencyId = action.payload;
    },
    setAddOtherAssetCurrency: (state, action) => {
      state.addOtherAssetCurrency = action.payload;
    },
    setAddOtherAssetCurrencyId: (state, action) => {
      state.addOtherAssetCurrencyId = action.payload;
    },
    setEditStocksCurrency: (state, action) => {
      state.editStockCurrency = action.payload;
    },
    setEditStocksCurrencyId: (state, action) => {
      state.editStockCurrencyId = action.payload;
    },
    setSellStocksCurrency: (state, action) => {
      state.sellStockCurrency = action.payload;
    },
    setSellStocksCurrencyId: (state, action) => {
      state.sellStockCurrencyId = action.payload;
    },
    setBuyStocksCurrency: (state, action) => {
      state.buyStockCurrency = action.payload;
    },
    setBuyStocksCurrencyId: (state, action) => {
      state.buyStockCurrencyId = action.payload;
    },
    setEditRealEstateCurrency: (state, action) => {
      state.editRealEstateCurrency = action.payload;
    },
    setEditRealEstateCurrencyId: (state, action) => {
      state.editRealEstateCurrencyId = action.payload;
    },
    setSellRealEstateCurrency: (state, action) => {
      state.sellRealEstateCurrency = action.payload;
    },
    setSellRealEstateCurrencyId: (state, action) => {
      state.sellRealEstateCurrencyId = action.payload;
    },
    setEditBankCurrency: (state, action) => {
      state.editBankCurrency = action.payload;
    },
    setEditBankCurrencyId: (state, action) => {
      state.editBankCurrencyId = action.payload;
    },
    setEditOtherAssetCurrency: (state, action) => {
      state.editOtherAssetCurrency = action.payload;
    },
    setEditOtherAssetCurrencyId: (state, action) => {
      state.editOtherAssetCurrencyId = action.payload;
    },
    setSellOtherAssetCurrency: (state, action) => {
      state.sellOtherAssetCurrency = action.payload;
    },
    setSellOtherAssetCurrencyId: (state, action) => {
      state.sellOtherAssetCurrencyId = action.payload;
    },
    setAddDebtCurrency: (state, action) => {
      state.addDebtCurrency = action.payload;
    },
    setAddDebtCurrencyId: (state, action) => {
      state.addDebtCurrencyId = action.payload;
    },
    setAddExpenseCurrency: (state, action) => {
      state.addExpenseCurrency = action.payload;
    },
    setAddDExpenseCurrencyId: (state, action) => {
      state.addExpenseCurrencyId = action.payload;
    },
    setAddIncomeCurrency: (state, action) => {
      state.addIncomeCurrency = action.payload;
    },
    setAddIncomeCurrencyId: (state, action) => {
      state.addIncomeCurrencyId = action.payload;
    },
    setBankClosureCurrency: (state, action) => {
      state.bankClosureCurrency = action.payload;
    },
    setBankClosureCurrencyId: (state, action) => {
      state.bankClosureCurrencyId = action.payload;
    },
    setAddCryptoCurrency: (state, action) => {
      state.addCryptoCurrency = action.payload;
    },
    setAddCryptoCurrencyId: (state, action) => {
      state.addCryptoCurrencyId = action.payload;
    },
    setBuyCryptoCurrency: (state, action) => {
      state.buyCryptoCurrency = action.payload;
    },
    setBuyCryptoCurrencyId: (state, action) => {
      state.buyCryptoCurrencyId = action.payload;
    },
    setSellCryptoCurrency: (state, action) => {
      state.sellCryptoCurrency = action.payload;
    },
    setSellCryptoCurrencyId: (state, action) => {
      state.sellCryptoCurrencyId = action.payload;
    },
    setEditCryptoCurrency: (state, action) => {
      state.editCryptoCurrency = action.payload;
    },
    setEditCryptoCurrencyId: (state, action) => {
      state.editCryptoCurrencyId = action.payload;
    },
    setMarketValueCurrency: (state, action) => {
      state.marketValueCurrency = action.payload;
    },
    setMarketValueCurrencyId: (state, action) => {
      state.marketValueCurrencyId = action.payload;
    },
  },
});

export const {
  setMainCurrency,
  setMainCurrencyId,
  setMainCurrencySymbol,
  setAddStocksCurrency,
  setAddStocksCurrencyId,
  setAddRealEstateCurrency,
  setAddRealEstateCurrencyId,
  setAddBankCurrency,
  setAddBankCurrencyId,
  setAddOtherAssetCurrency,
  setAddOtherAssetCurrencyId,
  setEditStocksCurrency,
  setEditStocksCurrencyId,
  setSellStocksCurrency,
  setSellStocksCurrencyId,
  setBuyStocksCurrency,
  setBuyStocksCurrencyId,
  setEditRealEstateCurrency,
  setEditRealEstateCurrencyId,
  setSellRealEstateCurrency,
  setSellRealEstateCurrencyId,
  setEditBankCurrency,
  setEditBankCurrencyId,
  setEditOtherAssetCurrency,
  setEditOtherAssetCurrencyId,
  setSellOtherAssetCurrency,
  setSellOtherAssetCurrencyId,
  setAddDebtCurrency,
  setAddDebtCurrencyId,
  setAddExpenseCurrency,
  setAddDExpenseCurrencyId,
  setAddIncomeCurrency,
  setAddIncomeCurrencyId,
  setBankClosureCurrency,
  setBankClosureCurrencyId,
  setAddCryptoCurrency,
  setAddCryptoCurrencyId,
  setBuyCryptoCurrency,
  setBuyCryptoCurrencyId,
  setSellCryptoCurrency,
  setSellCryptoCurrencyId,
  setEditCryptoCurrency,
  setEditCryptoCurrencyId,
  setMarketValueCurrency,
  setMarketValueCurrencyId,
} = currencySlice.actions;

export const selectedMainCurrency = (state) => state.currency.mainCurrency;
export const selectedMainCurrencyId = (state) => state.currency.mainCurrencyId;
export const SelectedCurrencySymbol = (state) =>
  state.currency.mainCurrencySymbol;

export const selectedAddStocksCurrency = (state) =>
  state.currency.addStocksCurrency;
export const selectedAddStocksCurrencyId = (state) =>
  state.currency.addStocksCurrencyId;
export const selectedAddRealEstateCurrency = (state) =>
  state.currency.addRealEstateCurrency;
export const selectedAddRealEstateCurrencyId = (state) =>
  state.currency.addRealEstateCurrencyId;
export const selectedAddBankCurrency = (state) =>
  state.currency.addBankCurrency;
export const selectedAddBankCurrencyId = (state) =>
  state.currency.addBankCurrencyId;
export const selectedAddOtherAssetCurrency = (state) =>
  state.currency.addOtherAssetCurrency;
export const selectedAddOtherAssetCurrencyId = (state) =>
  state.currency.addOtherAssetCurrencyId;
export const selectedEditStocksCurrency = (state) =>
  state.currency.editStockCurrency;
export const selectedEditStocksCurrencyId = (state) =>
  state.currency.editStockCurrencyId;
export const selectedSellStocksCurrency = (state) =>
  state.currency.sellStockCurrency;
export const selectedSellStocksCurrencyId = (state) =>
  state.currency.sellStockCurrencyId;
export const selectedBuyStocksCurrency = (state) =>
  state.currency.buyStockCurrency;
export const selectedBuyStocksCurrencyId = (state) =>
  state.currency.buyStockCurrencyId;
export const selectedEditRealEstateCurrency = (state) =>
  state.currency.editRealEstateCurrency;
export const selecteEditRealEstateCurrencyId = (state) =>
  state.currency.editRealEstateCurrencyId;
export const selectedSellRealEstateCurrency = (state) =>
  state.currency.sellRealEstateCurrency;
export const selecteSellRealEstateCurrencyId = (state) =>
  state.currency.sellRealEstateCurrencyId;
export const selectedEditBankCurrency = (state) =>
  state.currency.editBankCurrency;
export const selectedEditBankCurrencyId = (state) =>
  state.currency.editBankCurrencyId;
export const selectedEditOtherAssetCurrency = (state) =>
  state.currency.editOtherAssetCurrency;
export const selectedEditOtherAssetCurrencyId = (state) =>
  state.currency.editOtherAssetCurrencyId;
export const selectedSellOtherAssetCurrency = (state) =>
  state.currency.sellOtherAssetCurrency;
export const selectedSellOtherAssetCurrencyId = (state) =>
  state.currency.sellOtherAssetCurrencyId;

export const selectedAddDebtCurrency = (state) =>
  state.currency.addDebtCurrency;
export const selectedAddDebtCurrencyId = (state) =>
  state.currency.addDebtCurrencyId;

export const selectedAddExpenseCurrency = (state) =>
  state.currency.addExpenseCurrency;
export const selectedAddExpenseCurrencyId = (state) =>
  state.currency.addExpenseCurrencyId;

export const selectedAddIncomeCurrency = (state) =>
  state.currency.addIncomeCurrency;
export const selectedAddIncomeCurrencyId = (state) =>
  state.currency.addIncomeCurrencyId;

export const selectedBankClosureCurrency = (state) =>
  state.currency.bankClosureCurrency;
export const selectedBankClosureCurrencyId = (state) =>
  state.currency.bankClosureCurrencyId;

export const selectedAddCryptoCurrency = (state) =>
  state.currency.addCryptoCurrency;
export const selectedAddCryptoCurrencyId = (state) =>
  state.currency.addCryptoCurrencyId;

export const selectedBuyCryptoCurrency = (state) =>
  state.currency.buyCryptoCurrency;
export const selectedBuyCryptoCurrencyId = (state) =>
  state.currency.buyCryptoCurrencyId;

export const selectedSellCryptoCurrency = (state) =>
  state.currency.sellCryptoCurrency;
export const selectedSellCryptoCurrencyId = (state) =>
  state.currency.sellCryptoCurrencyId;

export const selectedEditCryptoCurrency = (state) =>
  state.currency.editCryptoCurrency;
export const selectedEditCryptoCurrencyId = (state) =>
  state.currency.editCryptoCurrencyId;

export const selectedMarketValueCurrency = (state) =>
  state.currency.marketValueCurrency;
export const selectedMarketValueCurrencyId = (state) =>
  state.currency.marketValueCurrencyId;

export default currencySlice.reducer;

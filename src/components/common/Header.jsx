/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Breadcrumbs from "./BreadCrumbs";
import caretdown from "../../assets/CaretDown.svg";
import plusicon from "../../assets/plusicon.svg";
import plusiconwhite from "../../assets/plusiconwhite.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import {
  setMainCurrency,
  setMainCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
  setMainCurrencySymbol,
  setAddStocksCurrency,
  setAddStocksCurrencyId,
  setAddRealEstateCurrency,
  setAddRealEstateCurrencyId,
  setAddBankCurrency,
  setAddBankCurrencyId,
  setAddOtherAssetCurrency,
  setAddOtherAssetCurrencyId,
  setAddIncomeCurrency,
  setAddIncomeCurrencyId,
  setAddExpenseCurrency,
  setAddDExpenseCurrencyId,
  setAddDebtCurrency,
  setAddDebtCurrencyId,
  setBuyStocksCurrency,
  setBuyStocksCurrencyId,
  setSellStocksCurrency,
  setSellStocksCurrencyId,
  setEditStocksCurrency,
  setEditStocksCurrencyId,
  setSellRealEstateCurrency,
  setSellRealEstateCurrencyId,
  setEditRealEstateCurrency,
  setEditRealEstateCurrencyId,
  setMarketValueCurrency,
  setMarketValueCurrencyId,
  setBankClosureCurrency,
  setBankClosureCurrencyId,
  setEditBankCurrency,
  setEditBankCurrencyId,
  setSellOtherAssetCurrency,
  setSellOtherAssetCurrencyId,
  setEditOtherAssetCurrency,
  setEditOtherAssetCurrencyId,
} from "../../redux/store/slice/currencySlice";

import {
  fetchCurrencyOptionsApi,
  currencyOptions,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";
import Logo from "../auth/logo";

const Header = ({ items }) => {
  const [currencyData, setCurrencyData] = useState([]);
  // const [selectedCurrencyId, setSelectedCurrencyId] = useState(21);
  // const [selectedCurr, setCurr] = useState("USD");
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const dispatch = useDispatch();

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  const onNavigateToFinancial = () => {
    navigate("/addfinancial");
  };

  useEffect(() => {
    dispatch(setAddStocksCurrency(selectedCurrency));
    dispatch(setAddStocksCurrencyId(selectedCurrencyId));

    dispatch(setAddRealEstateCurrency(selectedCurrency));
    dispatch(setAddRealEstateCurrencyId(selectedCurrencyId));

    dispatch(setAddBankCurrency(selectedCurrency));
    dispatch(setAddBankCurrencyId(selectedCurrencyId));

    dispatch(setAddOtherAssetCurrency(selectedCurrency));
    dispatch(setAddOtherAssetCurrencyId(selectedCurrencyId));

    dispatch(setAddIncomeCurrency(selectedCurrency));
    dispatch(setAddIncomeCurrencyId(selectedCurrencyId));

    dispatch(setAddExpenseCurrency(selectedCurrency));
    dispatch(setAddDExpenseCurrencyId(selectedCurrencyId));

    dispatch(setAddDebtCurrency(selectedCurrency));
    dispatch(setAddDebtCurrencyId(selectedCurrencyId));

    dispatch(setBuyStocksCurrency(selectedCurrency));
    dispatch(setBuyStocksCurrencyId(selectedCurrencyId));

    dispatch(setSellStocksCurrency(selectedCurrency));
    dispatch(setSellStocksCurrencyId(selectedCurrencyId));

    dispatch(setEditStocksCurrency(selectedCurrency));
    dispatch(setEditStocksCurrencyId(selectedCurrencyId));

    dispatch(setSellRealEstateCurrency(selectedCurrency));
    dispatch(setSellRealEstateCurrencyId(selectedCurrencyId));

    dispatch(setEditRealEstateCurrency(selectedCurrency));
    dispatch(setEditRealEstateCurrencyId(selectedCurrencyId));

    dispatch(setMarketValueCurrency(selectedCurrency));
    dispatch(setMarketValueCurrencyId(selectedCurrencyId));

    dispatch(setBankClosureCurrency(selectedCurrency));
    dispatch(setBankClosureCurrencyId(selectedCurrencyId));

    dispatch(setEditBankCurrency(selectedCurrency));
    dispatch(setEditBankCurrencyId(selectedCurrencyId));

    dispatch(setSellOtherAssetCurrency(selectedCurrency));
    dispatch(setSellOtherAssetCurrencyId(selectedCurrencyId));

    dispatch(setEditOtherAssetCurrency(selectedCurrency));
    dispatch(setEditOtherAssetCurrencyId(selectedCurrencyId));
  }, []);

  useEffect(() => {
    // getCurrencyData();
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  const getCurrencyData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}lists?subtype=currency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrencyData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onOpenCurrencyDropDown = () => {
    setOpen(!isOpen);
  };

  const onOpenCurrencyDropDown2 = () => {
    setOpen2(!isOpen2);
  };

  const onSelectCurrency = (currency) => {
    console.log("currency", currency);
    dispatch(setMainCurrency(currency.option));
    dispatch(setMainCurrencyId(currency.id));

    dispatch(setAddStocksCurrency(currency.option));
    dispatch(setAddStocksCurrencyId(currency.id));

    dispatch(setAddRealEstateCurrency(currency.option));
    dispatch(setAddRealEstateCurrencyId(currency.id));

    dispatch(setAddBankCurrency(currency.option));
    dispatch(setAddBankCurrencyId(currency.id));

    dispatch(setAddOtherAssetCurrency(currency.option));
    dispatch(setAddOtherAssetCurrencyId(currency.id));

    dispatch(setAddIncomeCurrency(currency.option));
    dispatch(setAddIncomeCurrencyId(currency.id));

    dispatch(setAddExpenseCurrency(currency.option));
    dispatch(setAddDExpenseCurrencyId(currency.id));

    dispatch(setAddDebtCurrency(currency.option));
    dispatch(setAddDebtCurrencyId(currency.id));

    dispatch(setBuyStocksCurrency(currency.option));
    dispatch(setBuyStocksCurrencyId(currency.id));

    dispatch(setSellStocksCurrency(currency.option));
    dispatch(setSellStocksCurrencyId(currency.id));

    dispatch(setEditStocksCurrency(currency.option));
    dispatch(setEditStocksCurrencyId(currency.id));

    dispatch(setSellRealEstateCurrency(currency.option));
    dispatch(setSellRealEstateCurrencyId(currency.id));

    dispatch(setEditRealEstateCurrency(currency.option));
    dispatch(setEditRealEstateCurrencyId(currency.id));

    dispatch(setMarketValueCurrency(currency.option));
    dispatch(setMarketValueCurrencyId(currency.id));

    dispatch(setBankClosureCurrency(currency.option));
    dispatch(setBankClosureCurrencyId(currency.id));

    dispatch(setEditBankCurrency(currency.option));
    dispatch(setEditBankCurrencyId(currency.id));

    dispatch(setSellOtherAssetCurrency(currency.option));
    dispatch(setSellOtherAssetCurrencyId(currency.id));

    dispatch(setEditOtherAssetCurrency(currency.option));
    dispatch(setEditOtherAssetCurrencyId(currency.id));

    if (currency.option === "USD") {
      dispatch(setMainCurrencySymbol("$"));
    } else if (currency.option === "EUR") {
      dispatch(setMainCurrencySymbol("€"));
    } else if (currency.option === "IND") {
      dispatch(setMainCurrencySymbol("₹"));
    } else if (currency.option === "AED") {
      dispatch(setMainCurrencySymbol("د.إ"))
    }
      else if (currency.option === "HKD") {
        dispatch(setMainCurrencySymbol("HK$"));
      }
      else if (currency.option === "SGD") {
        dispatch(setMainCurrencySymbol("S$"));
      }
    

    setOpen(false);
    setOpen2(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // setDropdownOpen(false);
      setOpen(false);
      //  setProfileOpen(false)
    }
  };

  const handleClickOutside2 = (event) => {
    if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
      // setDropdownOpen(false);
      setOpen2(false);
      //  setProfileOpen(false)
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, []);

  return (
    <>
      <div className="bg-[#121212] lg:flex flex-row w-full items-center justify-between h-[68px] px-10 hidden ">
        {/* <Breadcrumbs items={items} /> */}
        <div className="-ml-3 mt-2">
          <Logo />
        </div>
        <div className="flex items-center gap-5">
          <div
            ref={dropdownRef}
            onClick={onOpenCurrencyDropDown}
            className="relative bg-[#2E2E2E] rounded-[18px] w-[95px] h-[36px] flex justify-center items-center gap-4 cursor-pointer"
          >
            <span className="w-[20px] font-medium text-xs text-[#A8A8A8] text-roboto">
              {selectedCurrency}
            </span>
            <img
              src={caretdown}
              alt=""
              className={`${isOpen ? "rotate-180" : "rotate-0"}`}
            />
            {isOpen && (
              <div
                className="w-[81px] bg-[#2E2E2E] absolute top-10 z-50"
                // ref={dropdownRef}
              >
                {currencyOptionsData?.map((each, idx) => (
                  <p
                    onClick={() => onSelectCurrency(each)}
                    key={idx}
                    className={`text-[#F6F8FB] text-[16px] text-center font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${
                      selectedCurrencyId === each?.id && "bg-[#3E3E3E]"
                    }`}
                  >
                    {each.option}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={onNavigateToFinancial}
            className="w-[222px] h-[36px] rounded-[18px] bg-[#2E2E2E] text-xs text-[#C1C1C1] font-medium text-roboto flex items-center justify-center gap-5 hover:bg-[#9667F0] hover:text-white"
          >
            <img src={plusicon} alt="" className="" />
            ADD TRANSACTIONS
          </button>
          <Link
            to="/addassets"
            className="w-[222px] h-[36px] rounded-[18px] bg-[#9667F0] text-xs text-white font-medium text-roboto flex items-center justify-center gap-5"
          >
            <img src={plusiconwhite} alt="" className="" />
            ADD ASSET
          </Link>
        </div>
      </div>
      <div className="bg-[#121212] sticky top-[48px] flex flex-col w-full justify-between py-3 px-2 lg:hidden gap-2 pt-2 z-40">
        <div className="flex items-center justify-between">
          {/* <Breadcrumbs items={items} /> */}
          <Logo />
          <div
            ref={dropdownRef2}
            onClick={onOpenCurrencyDropDown2}
            className="relative w-[80px] ml-4 bg-[#2E2E2E] rounded-[18px] px-3 h-[36px] flex justify-center items-center gap-2 lg:gap-4  cursor-pointer"
          >
            <span className="w-[20px] font-medium text-xs text-[#A8A8A8] text-roboto">
              {selectedCurrency}
            </span>
            <img
              src={caretdown}
              alt=""
              className={`${isOpen2 ? "rotate-180" : "rotate-0"}`}
            />
            {isOpen2 && (
              <div
                className="w-[61px] bg-[#2E2E2E] absolute top-10 z-50"
                // ref={dropdownRef2}
              >
                {currencyOptionsData?.map((each, idx) => (
                  <p
                    onClick={() => onSelectCurrency(each)}
                    key={idx}
                    className={`text-[#F6F8FB] text-xs text-center font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${
                      selectedCurrencyId === each?.id && "bg-[#3E3E3E]"
                    }`}
                  >
                    {each.option}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-left flex-wrap gap-2">
          <button
            onClick={onNavigateToFinancial}
            className=" px-3 h-[36px] rounded-[18px] bg-[#2E2E2E] text-xs text-[#C1C1C1] font-medium text-roboto flex items-center justify-center lg:gap-5 gap-2 hover:bg-[#9667F0]"
          >
            <img src={plusicon} alt="" className="" />
            ADD TRANSACTIONS
          </button>
          <Link
            to="/addassets"
            className=" px-3 h-[36px] rounded-[18px] bg-[#9667F0] text-xs text-white font-medium text-roboto flex items-center justify-center lg:gap-5 gap-2"
          >
            <img src={plusiconwhite} alt="" className="" />
            ADD ASSET
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;

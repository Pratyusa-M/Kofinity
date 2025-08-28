/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import NoDataFoundStockPriceChart from "../common/noDataFoundStockPriceChart";
import { useState, useEffect } from "react";
import { FormatNumberWithCommas } from "../common/commaSeparatedNumbers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";

const formatNumberWithCommas = (number) => {
  // Check if the number is negative
  const isNegative = number < 0;

  // Round the absolute value of the number to two decimal places
  const absRoundedNumber = Math.round(Math.abs(number) * 100) / 100;
  const strNumber = absRoundedNumber.toString();
  const decimalIndex = strNumber.indexOf(".");
  let integerPart = strNumber;
  let decimalPart = "";

  if (decimalIndex !== -1) {
    integerPart = strNumber.slice(0, decimalIndex);
    decimalPart = strNumber.slice(decimalIndex, decimalIndex + 3); // Only keep two decimal places
  }

  let formattedNumber = "";

  if (integerPart.length <= 3) {
    // If the integer part is less than 1000, no need for commas
    formattedNumber = integerPart;
  } else if (integerPart.length <= 5) {
    // If the integer part is between 1000 and 99999, format it as xx,xxx
    formattedNumber =
      integerPart.slice(0, integerPart.length - 3) +
      "," +
      integerPart.slice(integerPart.length - 3);
  } else if (integerPart.length <= 7) {
    // If the integer part is between 100000 and 9999999, format it as x,xx,xxx
    formattedNumber =
      integerPart.slice(0, integerPart.length - 5) +
      "," +
      integerPart.slice(integerPart.length - 5, integerPart.length - 3) +
      "," +
      integerPart.slice(integerPart.length - 3);
  } else {
    // For integer parts greater than or equal to 1 crore
    formattedNumber =
      integerPart.slice(0, integerPart.length - 7) +
      "," +
      integerPart.slice(integerPart.length - 7, integerPart.length - 5) +
      "," +
      integerPart.slice(integerPart.length - 5, integerPart.length - 3) +
      "," +
      integerPart.slice(integerPart.length - 3);
  }

  // If the number is negative, add the minus sign separately
  formattedNumber = isNegative ? "-" + formattedNumber : formattedNumber;

  return formattedNumber + decimalPart;
};

const StockPriceChart1 = ({ stockPriceData }) => {
  console.log("Stock Price Data", stockPriceData);
  const [sortedData, setSortedData] = useState([]);
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  stockPriceData.sort((a, b) => b.stockPrice - a.stockPrice);
  const stockPriceData2 = [
    {
      id: 0,
      stockName: "Stocks",
      stockPrice: "$100k",
      stockShare: "40%",
      backgroundcolor: "#D6475D",
    },
    {
      id: 1,
      stockName: "Real Estate",
      stockPrice: "$100k",
      stockShare: "15%",
      backgroundcolor: "#6F50E5",
    },
    {
      id: 2,
      stockName: "Crypto",
      stockPrice: "$100k",
      stockShare: "15%",
      backgroundcolor: "#486DF0",
    },
    {
      id: 3,
      stockName: "Bank Account",
      stockPrice: "$100k",
      stockShare: "15%",
      backgroundcolor: "#85357D",
    },
    {
      id: 4,
      stockName: "Other Assets",
      stockPrice: "$200k",
      stockShare: "15%",
      backgroundcolor: "#9B51E0",
    },
  ];

  return (
    <div>
      {stockPriceData?.length === 5 && (
        <StockPriceChartA5
          data={stockPriceData}
          currSymbol={selectedCurencySymbol}
        />
      )}
      {stockPriceData?.length === 4 && (
        <StockPriceChartA5
          data={stockPriceData}
          currSymbol={selectedCurencySymbol}
        />
      )}
      {stockPriceData?.length === 3 && (
        <StockPriceChartA3
          data={stockPriceData}
          currSymbol={selectedCurencySymbol}
        />
      )}
      {stockPriceData?.length === 2 && (
        <StockPriceChartA2
          data={stockPriceData}
          currSymbol={selectedCurencySymbol}
        />
      )}
      {stockPriceData?.length === 1 && (
        <StockPriceChartA1
          data={stockPriceData}
          currSymbol={selectedCurencySymbol}
        />
      )}
      {stockPriceData?.length === 0 && <NoDataFoundStockPriceChart />}
    </div>
  );
};

const StockPriceChartA5 = ({ data, currSymbol }) => {
  const navigate = useNavigate();

  const navigateToRespectiveAsset = (assetName) => {
    if (assetName === "Stocks") {
      navigate("/stocks");
    } else if (assetName === "Real Estate") {
      navigate("/realestate");
    } else if (assetName === "Other Assets") {
      navigate("/otherassets");
    } else if (assetName === "Bank Account") {
      navigate("/bankaccount");
    } else if (assetName === "Crypto") {
      navigate("/crypto");
    }
  };

  return (
    <div>
      {data?.length > 0 ? (
        <div className="w-[100%] h-[538px] bg-[#191919] rounded-[2px] p-[24px] flex flex-col gap-[5px]">
          {/* <h1 className="text-[16px] text-[#ffffff] font-[500] text-roboto mb-[24px]">Allocation</h1> */}
          <div
            onClick={() => navigateToRespectiveAsset(data[0]?.stockName)}
            className="bg-[#D6475D] w-[100%] min-h-[189px] flex flex-col justify-center items-center rounded-[2px] cursor-pointer"
          >
            <p className="text-[20px] font-[500] text-[#ffffff] text-roboto">
              {currSymbol}
              {FormatNumberWithCommas(data[0]?.stockPrice || 0) || 0}
            </p>
            <p className="text-[14px] text-[#ffffff] font-[400] text-roboto">
              {data[0]?.stockName}. {data[0]?.stockShare?.toFixed(2) || 0}%
            </p>
          </div>
          <div className="flex justify-between flex-wrap w-[100%]">
            {data?.slice(1)?.map((each, idx) => (
              <div
                key={idx}
                onClick={() => navigateToRespectiveAsset(each?.stockName)}
                className={`h-[140px] w-[49.3%] rounded-[2px]  flex flex-col items-center justify-center mt-[2px] mb-[2px] cursor-pointer  ${
                  idx === 0 && "bg-[#6F50E5]"
                } ${idx === 1 && "bg-[#486DF0]"} ${
                  idx === 2 && "bg-[#85357D]"
                } ${idx === 3 && "bg-[#9B51E0]"}`}
              >
                <p className="text-[14px] font-[500] text-[#ffffff] text-roboto">
                  {currSymbol}
                  {FormatNumberWithCommas(each?.stockPrice || 0) || 0}
                </p>
                <p className="text-[10px] text-[#ffffff] font-[400] text-roboto">
                  {each?.stockName}. {each?.stockShare?.toFixed(2) || 0}%
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoDataFoundStockPriceChart />
      )}
    </div>
  );
};

const StockPriceChartA3 = ({ data, currSymbol }) => {
  return (
    <div>
      {data?.length > 0 ? (
        <div className="w-[100%] h-[538px] bg-[#191919] rounded-[2px] p-[24px] flex flex-col gap-[5px]">
          <h1 className="text-[16px] text-[#ffffff] font-[500] text-roboto mb-[24px]">
            Allocation
          </h1>
          <div className="bg-[#D6475D] w-[100%] h-[45%] flex flex-col justify-center items-center rounded-[2px]">
            <p className="text-[20px] font-[500] text-[#ffffff] text-roboto">
              {currSymbol}
              {FormatNumberWithCommas(data[0]?.stockPrice || 0) || 0}
            </p>
            <p className="text-[14px] text-[#ffffff] font-[400] text-roboto">
              {data[0]?.stockName}. {data[0]?.stockShare?.toFixed(2) || 0}%
            </p>
          </div>
          <div className="bg-[#6F50E5] w-[100%] h-[33%] flex flex-col justify-center items-center rounded-[2px]">
            <p className="text-[20px] font-[500] text-[#ffffff] text-roboto">
              {currSymbol}
              {FormatNumberWithCommas(data[1]?.stockPrice || 0) || 0}
            </p>
            <p className="text-[14px] text-[#ffffff] font-[400] text-roboto">
              {data[1]?.stockName}. {data[1]?.stockShare?.toFixed(2) || 0}%
            </p>
          </div>
          <div className="bg-[#486DF0] w-[100%] min-h-[22%] flex flex-col justify-center items-center rounded-[2px]">
            <p className="text-[20px] font-[500] text-[#ffffff] text-roboto">
              {currSymbol}
              {FormatNumberWithCommas(data[2]?.stockPrice || 0) || 0}
            </p>
            <p className="text-[14px] text-[#ffffff] font-[400] text-roboto">
              {data[2]?.stockName}. {data[2]?.stockShare?.toFixed(2) || 0}%
            </p>
          </div>
        </div>
      ) : (
        <NoDataFoundStockPriceChart />
      )}
    </div>
  );
};

const StockPriceChartA1 = ({ data, currSymbol }) => {
  return (
    <div>
      {data?.length > 0 ? (
        <div className="w-[100%] h-[538px] bg-[#191919] rounded-[2px] p-[24px] flex flex-col gap-[5px]">
          <h1 className="text-[16px] text-[#ffffff] font-[500] text-roboto mb-[24px]">
            Allocation
          </h1>
          <div className="bg-[#486DF0] w-[100%] h-[100%] flex flex-col justify-center items-center rounded-[2px]">
            <p className="text-[20px] font-[500] text-[#ffffff] text-roboto">
              {currSymbol}
              {FormatNumberWithCommas(data[0]?.stockPrice || 0) || 0}
            </p>
            <p className="text-[14px] text-[#ffffff] font-[400] text-roboto text-center">
              {data[0]?.stockName}. {data[0]?.stockShare?.toFixed(2) || 0}%
            </p>
          </div>
        </div>
      ) : (
        <NoDataFoundStockPriceChart />
      )}
    </div>
  );
};

const StockPriceChartA2 = ({ data, currSymbol }) => {
  return (
    <div>
      {data?.length > 0 ? (
        <div className="w-[100%] h-[538px] bg-[#191919] rounded-[2px] p-[24px] flex flex-col gap-[5px]">
          <h1 className="text-[16px] text-[#ffffff] font-[500] text-roboto mb-[24px]">
            Allocation
          </h1>
          {data?.map((each, idx) => (
            <div
              key={idx}
              className={`${
                each.id === 0 ? "bg-[#D6475D]" : "bg-[#975FEA]"
              } w-[100%] h-[50%] flex flex-col justify-center items-center rounded-[2px] text-center`}
            >
              <p className="text-[20px] font-[500] text-[#ffffff] text-roboto">
                {currSymbol}
                {FormatNumberWithCommas(each?.stockPrice || 0) || 0}
              </p>
              <p className="text-[14px] text-[#ffffff] font-[400] text-roboto">
                {each.stockName}. {each.stockShare?.toFixed(2) || 0}%
              </p>
            </div>
          ))}
        </div>
      ) : (
        <NoDataFoundStockPriceChart />
      )}
    </div>
  );
};

export default StockPriceChart1;

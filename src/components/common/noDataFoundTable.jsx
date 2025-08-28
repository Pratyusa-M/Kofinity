/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import Arrow1 from "../../assets/arrow1.svg";
import arrow2 from "../../assets/arrow2.svg";
import tableplus from "../../assets/tableplus.png";
import tableminus from "../../assets/tableminus.svg";
import tabledit from "../../assets/tabledit.svg";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";

import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";

const NoDataFoundTable = ({
  tableHeadings,
  tableData,
  tableProps,
  profit,
  profitPercent,
  assetValue,
}) => {
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);

  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString.replace("%", ""), 10);
    return intValue < 0;
  };

  const TableLoading = () => {
    return (
      <div className="w-[100%] h-[100px] flex justify-center items-center">
        <TailSpin
          height="40"
          width="40"
          color="white"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="relative text-roboto overflow-x-auto shadow-md sm:rounded-lg bg-[#191919] rounded-[4px] max-h-[465px] overflow-y-auto ">
        <div className="text-[#FFFFFF] text-[20px] font-[500] m-[24px] text-roboto">
          {tableProps?.title}
        </div>
        <div className="m-[24px] flex items-center text-lato">
          <div className="text-[#FFFFFF] text-2xl md:text-[32px] font-[400]">
            {selectedCurencySymbol}
            {Math.round(assetValue) || 0}
          </div>
          <div
            className={` text-base font-[400] ml-2 ${
              profitPercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
            }`}
          >
            {selectedCurencySymbol}
            {Math.round(profit) || 0}
          </div>
          <div
            className={`w-[56px] h-[18px] radius-[2px] bg-[#2E2E2E] text-sm font-[400]  ml-2 flex items-center justify-evenly ${
              profitPercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
            }`}
          >
            <div>
              {/* {tableProps?.percentageChange} */}
              {Math.round(profitPercent) || 0}%
            </div>
            <div>
              {" "}
              {profitPercent >= 0 ? (
                <img src={Arrow1} alt="positive" />
              ) : (
                <img src={arrow2} alt="negative" />
              )}
            </div>
          </div>
        </div>
        {TableLoading()}
      </div>
    </div>
  );
};

export default NoDataFoundTable;

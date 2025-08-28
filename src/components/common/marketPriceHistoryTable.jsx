/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import Arrow1 from "../../assets/arrow1.svg";
import arrow2 from "../../assets/arrow2.svg";
import tableplus from "../../assets/tableplus.png";
import tableminus from "../../assets/tableminus.svg";
import tabledit from "../../assets/tabledit.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { FormatNumberWithCommas } from "./commaSeparatedNumbers";

const MarketPriceHistoryTable = ({ tableHeadings, tableData }) => {
  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString.replace("%", ""), 10);
    return intValue < 0;
  };

  return (
    <div>
      <div className=" relative text-roboto overflow-x-auto shadow-md sm:rounded-lg bg-[#191919] rounded-[4px] max-h-[465px] overflow-y-auto ">
        {tableData.length > 0 ? (
          <div>
            <table className="w-full text-roboto border-separate border-spacing-y-[10px] mb-2 table-auto ">
              <thead className="">
                <tr>
                  {tableHeadings?.map((heading, idx) => {
                    return (
                      <th
                        key={idx}
                        scope="col"
                        className="px-[24px] py-[16px] text-start text-base font-[500] text-[#FFFFFF] leading-[20px]"
                      >
                        <p className="">{heading}</p>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((row, idx) => {
                  return (
                    <tr className="bg-[#1D1D1F] cursor-pointer" key={idx}>
                      {row?.map((data, index) => {
                        return (
                          <td
                            key={index}
                            className="px-[24px] py-[16px] text-[#F6F8FB] font-[400] text-base leading-[24px] tracking-[0.15px]"
                          >
                            {data}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-[#ffffff] text-[22px] mb-3 font-[400] h-[240px] flex justify-center items-center">
            No Transaction History Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPriceHistoryTable;

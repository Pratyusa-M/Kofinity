/* eslint-disable no-constant-condition */
const Stockpricegraph = () => {
  const stockPriceData = [
    {
      id: 0,
      stockName: "Stocks",
      stockPrice: "$200k",
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
      stockPrice: "$100k",
      stockShare: "15%",
      backgroundcolor: "#9B51E0",
    },
  ];

  const largestStockPrice = stockPriceData.reduce((maxPrice, data) => {
    return maxPrice === null || data.stockPrice > maxPrice.stockPrice
      ? data
      : maxPrice;
  }, null);
  console.log("Largest Stock Price:", largestStockPrice);

  const updatedStockPriceData = stockPriceData.filter(
    (data) => data.stockPrice !== largestStockPrice.stockPrice
  );
  console.log("Updated Stock Price Data:", updatedStockPriceData);

  const colors = [
    updatedStockPriceData[0]?.backgroundcolor,
    updatedStockPriceData[1]?.backgroundcolor,
    updatedStockPriceData[2]?.backgroundcolor,
    updatedStockPriceData[3]?.backgroundcolor,
  ];

  const labels = {};

  updatedStockPriceData.forEach((name, index) => {
    labels[name.backgroundcolor] = colors[index];
  });

  return (
    <>
      <div className="w-[100%]">
        {/* <div className=" w-[240px] sm:w-[263px] h-[523px] flex justify-center items-center mt-12 bg-[#191919] opacity-90 rounded-sm ml-8"> */}
        <div className=" w-[240px] sm:w-[263px] h-[523px] flex justify-center items-center bg-[#191919] opacity-90 rounded-sm ml-8">

          <div className="flex flex-col gap-1 h-[500px] p-4 ">
            {/* <p className="text-white">Allocation</p> */}
            <div
              className={`flex w-[180px] sm:w-[216px] ${
                stockPriceData.length == 1
                  ? "h-[480px]"
                  : "h-[150px]" ||
                    (stockPriceData.length > 1 &&
                      updatedStockPriceData.length == 1)
                  ? "h-[235px]"
                  : "h-[150px]"
              } ${
                stockPriceData.length == 1
                  ? "sm:h-[480px]"
                  : "sm:h-[189px]" ||
                    (stockPriceData.length > 1 &&
                      updatedStockPriceData.length == 1)
                  ? "sm:h-[231px]"
                  : "sm:h-[189px]"
              } justify-center items-center rounded-sm`}
              style={{
                backgroundColor: `${largestStockPrice?.backgroundcolor}`,
              }}
            >
              <div className="flex flex-col w-[80px] h-[40px] justify-center items-center gap-1">
                <div className="text-[20px] text-[#FFFFFF] font-[500] text-roboto ">
                  {largestStockPrice?.stockPrice}
                </div>
                <div className=" flex justify-center items-center gap-1">
                  <div
                    className={`${
                      (largestStockPrice.stockName == "Stocks" && "w-[45px]") ||
                      (largestStockPrice.stockName == "Crypto" && "w-[45px]") ||
                      (largestStockPrice.stockName == "Real Estate" &&
                        "w-[75px]") ||
                      (largestStockPrice.stockName == "Other Assets" &&
                        "w-[83px]") ||
                      (largestStockPrice.stockName == "Bank Account" &&
                        "w-[87px]")
                    } 
                    text-[14px] text-[#FFFFFF] font-[400] text-roboto`}
                  >
                    {largestStockPrice?.stockName}
                  </div>
                  <div className="text-[#FFFFFF] text-[10px] mb-0">.</div>
                  <div className="text-[14px] text-[#FFFFFF] font-[400] text-roboto ">
                    {largestStockPrice?.stockShare}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`grid
               ${
                 (stockPriceData.length > 1 &&
                   updatedStockPriceData.length === 1 &&
                   "sm:grid") ||
                 (stockPriceData.length > 1 &&
                   updatedStockPriceData.length === 2 &&
                   "sm:grid ") ||
                 (stockPriceData.length > 1 &&
                   updatedStockPriceData.length === 3 &&
                   "grid sm:grid-cols-2 ")
               }
               ${updatedStockPriceData.length === 4 && "grid sm:grid-cols-2"}
              gap-2  sm:gap-1 `}
            >
              {updatedStockPriceData.map((data, idx) => (
                <div
                  className={`flex ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 1
                      ? "w-[180px]"
                      : "w-[106px]"
                  } 
                  ${
                    (stockPriceData.length > 1 &&
                      updatedStockPriceData.length === 1) ||
                    updatedStockPriceData.length === 2
                      ? "sm:w-[216px]"
                      : "sm:w-[106px]"
                  } 
                  ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 1
                      ? "h-[222px]"
                      : "h-[70px]"
                  }
                  ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 1
                      ? "sm:h-[229px]"
                      : "sm:h-[140px]"
                  }
                 ${
                   stockPriceData.length > 1 &&
                   updatedStockPriceData.length == 2
                     ? idx % 2 === 0
                       ? "h-[110px]"
                       : "h-[80px]"
                     : "h-[70px]"
                 }  ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 2
                      ? idx % 2 === 0
                        ? "sm:h-[130px]"
                        : "sm:h-[91px]"
                      : "sm:h-[140px]"
                  }
                  ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 1
                      ? "ml-0 sm:ml-0"
                      : "ml-10 sm:ml-0"
                  }
                  ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 1
                      ? "mt-4 sm:mt-[5px]"
                      : "mt-4 sm:mt-1 "
                  }
                  ${
                    stockPriceData.length > 1 &&
                    updatedStockPriceData.length == 2
                      ? "mt-6 sm:mt-[2px]"
                      : "mt-4 sm:mt-1 "
                  }
                  justify-center items-center rounded-sm`}
                  key={data?.id}
                  style={{ backgroundColor: `${labels[data.backgroundcolor]}` }}
                >
                  <div className="flex flex-col w-[80px] h-[40px] justify-center items-center gap-1">
                    <div className="text-[14px] text-[#FFFFFF] font-[500] text-roboto ">
                      {data?.stockPrice}
                    </div>
                    <div className="w-[100px] flex justify-center items-center gap-1">
                      <div className="text-[10px] text-[#FFFFFF] font-[400] text-roboto ">
                        {data?.stockName}
                      </div>
                      <div className="text-[#FFFFFF] text-[10px] mb-0">.</div>
                      <div className="text-[10px] text-[#FFFFFF] font-[400] text-roboto ">
                        {data?.stockShare}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stockpricegraph;

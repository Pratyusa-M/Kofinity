
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import NetAssetvalueChart from "../../components/portfolio/netAssetValueChart";
// import Stockpricegraph from "./stockpricegraph";
import StockPriceChart1 from "../../components/portfolio/stockPriceChart1";
import GrossAssetMoversChart from "../../components/portfolio/grossAssetMoversChart";
import Table from "../../components/common/Table";

const items = [{ label: "Portfolio > All Assets", link: "./" }];

const tableProps = {
  title: "All Assets",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadings = ["Assets", "Book value", "Market value", "Gain & Loss"];

const tableData = [
  ["Stocks", "$5000", "$4500"],
  ["Real Estate", "$5000", "$4500"],
  ["Crypto", "$5000", "$4500"],
  ["Banks", "$5000", "$4500"],
  ["Other Assets", "$5000", "$4500"],
];

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


const NetAssetValuePage = () => {
  return (
    <div className="h-full w-full flex flex-col  items-center text-4xl text-roboto font-[600] text-white bg-black">
      <Header items={items} />
      <div className=" w-full flex flex-col gap-[32px] mt-[32px] pl-[24px] pr-[28px] pb-[82px]">
        <div className="flex justify-between w-[100%]">
            <div className="w-[76%]">
                <NetAssetvalueChart />
            </div>
            <div className="w-[22%]">
               <StockPriceChart1 stockPriceData={stockPriceData}/>
            </div>

        </div>
        <div>
        <Table
        tableProps={tableProps}
        tableHeadings={tableHeadings}
        tableData={tableData}
      />
        </div>
        <div className="w-[100%] p-[24px] bg-[#191919] rounded-[2px]">
            <h1 className="text-[16px] font-[500] text-roboto text-[#ffffff] mb-[24px]">My Movers</h1>
            <div>
                <GrossAssetMoversChart moversText={'Stocks'}/>
            </div>

        </div>
      </div>
    </div>
  );
};

const NetAssetValue = () => {
  return <Sidebar layout={<NetAssetValuePage />} />;
};
export default NetAssetValue;

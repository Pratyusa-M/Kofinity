/* eslint-disable no-unused-vars */
import Welcome from "../../components/Home/Welcome";
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import Table from "../../components/common/Table";

const items = [{ label: "Home", link: "./" }];

const tableProps = {
  title: "All Assets",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tablePropsStocks = {
  title: "Stocks",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tablePropsRealEstate = {
  title: "Real Estate",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tablePropsCrypto = {
  title: "Crypto",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};
const tablePropsBankAccount = {
  title: "Bank Account",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};
const tablePropsOtherAssets = {
  title: "Other Assets",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadings = ["Assets", "Book value", "Market value", "Gain & Loss"];
const tableHeadingsStocks = [
  "Assets",
  "Quantity",
  "Average unit cost",
  "Book value",
  "Market price",
  "Market value",
  "Gain & Loss",
  "Actions",
];
const tableHeadingsRealEstate = [
  "Assets",
  "Purchased value",
  "Current value",
  "Gain & Loss",
  "Actions",
];
const tableHeadingsCrypto = [
  "Assets",
  "Quantity",
  "Average unit cost",
  "Book value",
  "Market price",
  "Market value",
  "Gain & Loss",
  "Actions",
];

const tableHeadingsBankAccount = [
  "Assets",
  "Cash",
  "Interest rate(%)",
  "Gain & Loss",
  "Actions",
];
const tableHeadingsOtherAssets = [
  "Assets",
  "Purchased value",
  "Current value",
  "Gain & Loss",
  "Actions",
];

const tableData = [
  ["Stocks", "$5000", "$4500"],
  ["Real Estate", "$5000", "$4500"],
  ["Crypto", "$5000", "$4500"],
  ["Banks", "$5000", "$4500"],
  ["Other Assets", "$5000", "$4500"],
];

const tableDataStocks = [
  ["Apple(AAPL)", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["Microsoft(MSFT)", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["Tesla(TSLA)", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["S&P(S&P 500)", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["Nvidia(NVDA)", "$5000", "$5000", "$4500", "$4500", "$4500"],
];

const tableDataRealEstate = [
  ["Plot-1", "$5000", "$4500"],
  ["House -312", "$5000", "$4500"],
  ["Flat BxB", "$5000", "$4500"],
  ["Plot-2", "$5000", "$4500"],
  ["Plot-33", "$5000", "$4500"],
];

const tableDataCrypto = [
  ["Luna", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["Lite coin", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["Shibu uno", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["XRS", "$5000", "$5000", "$4500", "$4500", "$4500"],
  ["Bitcoin", "$5000", "$5000", "$4500", "$4500", "$4500"],
];

const tableDataBankAccount = [["Citi bank", "$5000", "0.2"]];

const tableDataOtherAssets = [
  ["Gold watch", "$5000", "$4500"],
  ["Jewellery", "$5000", "$4500"],
];

const HomePage = () => {
  return (
    <div className="h-full w-full">
      <Header items={items} />
      <div className="w-[100%] flex justify-center items-center h-[90%] p-3 bg-black">
        <Welcome />
      </div>
    </div>
  );
};

const Home = () => {
  return <Sidebar layout={<HomePage />} />;
};
export default Home;

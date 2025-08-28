/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";

import Table from "../../components/common/Table";
import AllAssetsTable from "../../components/common/allAssetsTable";

const items = [{ label: "Asset Management", link: "./" }];

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

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
  ["Luna", "$5000", "$5000", "$4500", "$4500", "$4500", 100, "40%"],
  ["Lite coin", "$5000", "$5000", "$4500", "$4500", "$4500", 150, "25%"],
  ["Shibu uno", "$5000", "$5000", "$4500", "$4500", "$4500", 120, "23%"],
  ["XRS", "$5000", "$5000", "$4500", "$4500", "$4500", 110, "50%"],
  ["Bitcoin", "$5000", "$5000", "$4500", "$4500", "$4500", 130, "60%"],
];

const tableDataBankAccount = [["Citi bank", "$5000", "0.2"]];

const tableDataOtherAssets = [
  ["Gold watch", "$5000", "$4500"],
  ["Jewellery", "$5000", "$4500"],
];

const AssetManagementPage = () => {
  const [realEstateData, setRealEstateData] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [banksData, setBanksData] = useState([]);
  const [otherAssetsData, setOtherAssetsData] = useState([]);
  const [allAssetsData, setAllAssetsData] = useState([]);

  useEffect(() => {
    getRealEstateData();
    getStocksData();
    getBanksData();
    getOtherAssets();
    getAllAssetsData();
  }, []);

  const convertAllAssetsData = (data) => {
    const tableDataAllStocks = [
      `Stocks`,
      `$${data[0].stock_purchase_value}`,
      `$${data[0].stock_current_value}`,
      // `${data[0].stock_gainOrLoss_value}`,
      // `${data[0].stock_gainOrLoss_percent}%`,
    ];

    const tableDataAllrealEstate = [
      `Real Estate`,
      `$${data[0].realEstate_purchase_value}`,
      `$${data[0].realEstate_current_value}`,
      // `${data[0].realEstate_gainOrLoss_value}`,
      // `${data[0].realEstate_gainOrLoss_percent}%`,
    ];

    const tableDataAllOtherAssets = [
      `Real Estate`,
      `$${data[0].otherAsset_purchase_value}`,
      `$${data[0].otherAsset_current_value}`,
      // `${data[0].otherAsset_gainOrLoss_value}`,
      // `${data[0].otherAsset_gainOrLoss_percent}%`,
    ];

    setAllAssetsData([
      tableDataAllStocks,
      tableDataAllrealEstate,
      tableDataAllOtherAssets,
    ]);
  };

  const convertStockData = (data) => {
    const tableDataStocks = data.map((item) => [
      `(${item.ticker.name})`,
      `$${item.purchase_quantity}`,
      `$${item.purchase_price}`,
      `$${item.total_purchase_value}`,
      `$${item.market_price}`,
      `$${item.total_market_value}`,
      `${item.gain_loss_val}`,
      `${item.gain_loss_percent}%`,
    ]);

    setStocksData(tableDataStocks);
  };

  const convertRealEstateData = (data) => {
    const tableDataRealEstate = data.map((item, index) => [
      `Plot-${index + 1}`,
      `$${item.purchase_price}`,
      `$${item.estimate_current_value}`,
      `$100`,
      `30%`,
    ]);

    setRealEstateData(tableDataRealEstate);
  };

  const convertBanksData = (data) => {
    const bankData = data.map((item) => [
      item.bank_name?.name || "N/A", // Bank name
      `$${item.initial_balance}`, // Account balance
      `${item.annual_interest_rate}%`, // Annual interest rate
      `${item.gain_loss_val}`,
      `${item.gain_loss_percent}%`,
    ]);

    setBanksData(bankData);
  };

  const convertOtherAssetsData = (data) => {
    const OtherAssetsData = data.map((item) => [
      item.asset_name || "N/A", // Bank name
      `$${item.purchase_price}`, // Account balance
      `${item.current_price}`,
      `$${item.gain_loss_val}`,
      `${item.gain_loss_percent}%`,
    ]);

    setOtherAssetsData(OtherAssetsData);
  };

  const getStocksData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      convertStockData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRealEstateData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}real-estate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      convertRealEstateData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBanksData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}bank-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      convertBanksData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getOtherAssets = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}other-asset`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      convertOtherAssetsData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllAssetsData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}user-assets/current/value/history?interval=oneDay`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertAllAssetsData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="h-full w-full flex flex-col  items-center text-4xl text-roboto font-[600] text-white bg-black">
      <Header items={items} />
      <div className=" w-full flex flex-col gap-[32px] mt-[32px] pl-[24px] pr-[28px] pb-[82px]">
        <AllAssetsTable
          tableProps={tableProps}
          tableHeadings={tableHeadings}
          tableData={allAssetsData}
          // tableData={tableData}
        />
        <Table
          tableProps={tablePropsStocks}
          tableHeadings={tableHeadingsStocks}
          tableData={stocksData ? stocksData : []}
        />
        <Table
          tableProps={tablePropsRealEstate}
          tableHeadings={tableHeadingsRealEstate}
          tableData={realEstateData ? realEstateData : []}
        />
        <Table
          tableProps={tablePropsCrypto}
          tableHeadings={tableHeadingsCrypto}
          tableData={tableDataCrypto}
        />
        <Table
          tableProps={tablePropsBankAccount}
          tableHeadings={tableHeadingsBankAccount}
          tableData={banksData ? banksData : []}
        />
        <Table
          tableProps={tablePropsOtherAssets}
          tableHeadings={tableHeadingsOtherAssets}
          tableData={otherAssetsData ? otherAssetsData : []}
        />
      </div>
    </div>
  );
};

const AssetManagement = () => {
  return <Sidebar layout={<AssetManagementPage />} />;
};
export default AssetManagement;

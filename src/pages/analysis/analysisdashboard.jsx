import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ROIChart from "./charts/ROIChart";
import KPIGauge from "./charts/KPIGauge";
import GaugeChart from "./charts/GaugeChart";
import HorizontalBarChart from "./charts/HorizontalBarChart";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/common/Header";
// import Breadcrumbs from '../../components/common/BreadCrumbs';
import { baseUrl } from "../../utils/baseUrl";
import { ChevronDown, ChevronUp, PlusIcon } from "lucide-react";
import AddTargetModal from "./AddTargetModal";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";
import { useSelector } from "react-redux";

const items = [{ label: "Portfolio > Crypto", link: "./" }];

const AnalysisDashboard = () => {
  const [selectedAssetType, setSelectedAssetType] = useState("all");
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [target, setTarget] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const desktopdropdownRef = useRef();
  const mobiledropdownRef = useRef();

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const assetOptions = [
    { label: "All", value: "all" },
    { label: "Real Estate", value: "realEstate" },
    { label: "Crypto", value: "crypto" },
    { label: "Stocks", value: "stocks" },
    { label: "Other Assets", value: "otherAsset" },
  ];

  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({
    roi: [],
    expenseRatio: {},
    yield: [],
    roiBreakdown: [],
    kpi: {},
    gauge: {},
  });

   useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target 
      // if neither ref contains the click, close
      if (
        desktopdropdownRef.current &&
        !desktopdropdownRef.current.contains(target) &&
        mobiledropdownRef.current &&
        !mobiledropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${baseUrl}analysis`, {
          params: {
            desiredCurrency: selectedCurrencyId,
            assetType: selectedAssetType,
            targetAmt: targetAmount,
            targetType: target,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;

        setGraphData({
          roi: data.graphDataROI,
          expenseRatio: data?.expenseRatios,
          yield: data?.yieldRatios,
          roiBreakdown: data?.roiBreakdown,
          kpiData: data?.kpiData,
          gauge: data.gaugeData,
        });
      } catch (err) {
        console.error("Error fetching analysis data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedAssetType, target, targetAmount, selectedCurrencyId]);

  const handleAddTarget = ({ targetKey, amount }) => {
    console.log("Adding target:", targetKey, amount);
    setTarget(targetKey);
    setTargetAmount(amount);
    setShowAddTarget(false);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Header items={items} />
      <div className=" mx-auto px-4 md:py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-[24px] md:text-3xl font-semibold my-6">Analysis</h1>
          <div className="flex items-center gap-4">
          <div className="md:flex hidden  flex-wrap justify-between items-center gap-4 w-full sm:w-auto">
          <div className=" flex items-center">
            <label htmlFor="assetType" className="text-sm text-gray-300 mr-2">
              Asset:
            </label>
            <div className="relative w-40" ref={desktopdropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center bg-gray-950 border b-slate-500 rounded-2xl text-white p-2"
                id="assetTypeButton"
              >
                {assetOptions.find((opt) => opt.value === selectedAssetType)
                  ?.label || "Select Asset Type"}
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {isDropdownOpen && (
                <ul className="absolute w-full mt-1 bg-[#0A0A0C] border border-[#19191D] rounded-2xl z-10">
                  {assetOptions.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => {
                        setSelectedAssetType(opt.value);
                        setIsDropdownOpen(false);
                      }}
                      className="p-2 text-white hover:bg-gray-800 cursor-pointer"
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
          <button
            onClick={() => setShowAddTarget(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-3xl "
          >
            <PlusIcon className="inline mr-2" />
            Add Target
          </button>
          </div>
        </div>
        <div className="md:hidden flex mb-3 flex-wrap justify-between items-center gap-4 w-full sm:w-auto">
          <div className=" flex items-center w-full">
            <label htmlFor="assetType" className="text-sm text-gray-300 mr-2">
              Asset:
            </label>
            <div className="relative w-full" ref={mobiledropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center bg-gray-950 border b-slate-500 rounded-2xl text-white p-2"
                id="assetTypeButton"
              >
                {assetOptions.find((opt) => opt.value === selectedAssetType)
                  ?.label || "Select Asset Type"}
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {isDropdownOpen && (
                <ul className="absolute w-full mt-1 bg-[#0A0A0C] border border-[#19191D] rounded-2xl z-10">
                  {assetOptions.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={() => {
                        setSelectedAssetType(opt.value);
                        setIsDropdownOpen(false);
                      }}
                      className="p-2 text-white hover:bg-gray-800 cursor-pointer"
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="w-10 h-10 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
              <div className="lg:col-span-2 rounded-xl md:p-4">
                <ROIChart data={graphData.roi} />
              </div>
              <div className="lg:col-span-1 rounded-xl md:p-4">
                <KPIGauge
                  value={graphData?.kpiData}
                  targetType={target}
                  max={graphData?.kpiData?.max}
                  title="Current GAV"
                  subtitle={`$${graphData.kpiData?.max?.toLocaleString()}`}
                  color="#9b87f5"
                />
              </div>
              <div className="lg:col-span-1 rounded-xl md:p-4">
                <GaugeChart
                  cashFlow={graphData.gauge?.cashFlow}
                  profitLoss={graphData.gauge?.profitLoss}
                  primaryColor="#9b87f5"
                  totalValue={graphData.gauge?.totalValue || 0}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="9  rounded-xl md:p-4">
                <HorizontalBarChart
                  title="Expense Ratio"
                  data={graphData.expenseRatio}
                  color="#ff5757"
                />
              </div>
              <div className=" rounded-xl md:p-4">
                <HorizontalBarChart
                  title="Yield"
                  data={graphData.yield}
                  color="#9b87f5"
                />
              </div>
              <div className=" rounded-xl md:p-4">
                <HorizontalBarChart
                  title="ROI Breakdown"
                  data={graphData.roiBreakdown}
                  color="#ff5757"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <AddTargetModal
        isOpen={showAddTarget}
        onClose={() => setShowAddTarget(false)}
        onAdd={handleAddTarget}
      />
    </div>
  );
};

const AnalysisDashboardPage = () => {
  return <Sidebar layout={<AnalysisDashboard />} />;
};

export default AnalysisDashboardPage;

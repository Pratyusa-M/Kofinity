/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import chartdynamiccolor from "../../assets/chartdynamiccolor.png";
import cubedynamicblue from "../../assets/cubedynamicblue.png";
import ethdynamiccolor from "../../assets/ethdynamiccolor.png";
import moneydynamiccolor from "../../assets/moneydynamiccolor.png";
import lockerdynamiccolor from "../../assets/lockerdynamiccolor.png";
// import Chain from "../../assets/Chain.png";
import closeicon from "../../assets/closeicon.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import AssetsModal from "./assetsModal";
import AssetsModal2 from "./assetModal2";
import AddAssetsSuccessModal from "./addAssetsSuccessModal";
import { TailSpin } from "react-loader-spinner";

const assetsData = [
  {
    id: 0,
    assetsName: "Stocks",
    imageSrc: chartdynamiccolor,
    assetsValue: "Connect your brokerage and investment account.",
  },
  {
    id: 1,
    assetsName: "Real Estate",
    imageSrc: cubedynamicblue,
    assetsValue:
      "Residential, rental property, commercial real estate and land.",
  },
  {
    id: 2,
    assetsName: "Crypto",
    imageSrc: ethdynamiccolor,
    assetsValue: "All your valuable crypto currency assets.",
  },
  {
    id: 3,
    assetsName: "Bank Accounts",
    imageSrc: moneydynamiccolor,
    assetsValue: "Connect your brokage and investment account.",
  },
  {
    id: 4,
    assetsName: "Other Assets",
    imageSrc: lockerdynamiccolor,
    assetsValue: "All the other important and exotic investments",
  },
  // {
  //   id: 5,
  //   assetsName: "Auto Synchronization",
  //   imageSrc: Chain,
  //   assetsValue: "All the other important and exotic investments",
  // },
];

const AddAssets = () => {
  const [buttoncolor, setbuttoncolor] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [assetId, setAssetId] = useState();
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [isShowLoadingScreen, setShowLoadingScreen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const modOPen = location?.state?.openModal;
  const modalText = location?.state?.modalText;

  useEffect(() => {
    localStorage.removeItem("formData1");
    localStorage.removeItem("formData2");
    localStorage.removeItem("formData3");
    localStorage.removeItem("realDropDownData1");
    localStorage.removeItem("realDropDownData2");
    localStorage.removeItem("StocksFormData");
    localStorage.removeItem("CryptoFormData");
    localStorage.removeItem("StockTickerId");
    localStorage.removeItem("cryptoTickerId");
    localStorage.removeItem("OtherAssetFormData");
    localStorage.removeItem("otherAssetDropDownData");
    sessionStorage.removeItem("otherSCode");
  }, []);
  const naviagteToHome = () => {
    setShowLoadingScreen(true);
    setTimeout(() => {
      setShowLoadingScreen(false);
      navigate("/allassets");
    }, 3000);
  };

  useEffect(() => {
    if (modOPen) {
      setsuccessModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleButtonClick = async (buttonId) => {
    if (buttonId !== 3) {
      setAssetId(buttonId);
      setbuttoncolor(buttonId);
      setIsOpen(true);
    } else {
      setAssetId(buttonId);
      setbuttoncolor(buttonId);
      //setIsOpen(true);
      navigate("/addbankaccount2", { state: { addBankRoute: "/addAssets" } });
    }
  };

  const handleFileUploadModal = async () => {
    setsuccessModalOpen(true);
    // navigate({ state: { openModal: false } });
  };

  const closeSuccessModal = () => {
    setsuccessModalOpen(false);
    navigate({ state: { openModal: false } });
  };

  const showingLoadingScreen = () => {
    return (
      <div className=" w-full h-[100vh] bg-[#121212] pt-5">
        <h1 className="text-[#ffffff] text-[25px] font-[600] text-center">
          Back to All Assets
        </h1>
        <div className="h-[90%] flex justify-center items-center">
          <TailSpin
            height="50"
            width="50"
            color="white"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {isShowLoadingScreen && showingLoadingScreen()}
      {!isShowLoadingScreen && (
        <div className=" flex flex-col w-full min-h-screen bg-[#121212] overflow-auto">
          <div className="flex justify-end">
            <div
              className="flex w-[78px] h-[24px] self-end mt-6 mr-8 cursor-pointer"
              onClick={naviagteToHome}
            >
              <img src={closeicon} alt="closeIcon" />
            </div>
          </div>

          <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] flex flex-col justify-center mt-20 mb-10 self-center ">
            <h1 className="w-full text-[#ffffff] text-[24px] text-roboto font-[500] mb-10">
              Add Assets
            </h1>
            <div className="flex flex-wrap gap-[40px] lg:gap-[50px]">
              {assetsData.map((data, idx) => (
                <div
                  className={`w-[100%] lg:w-[45%] h-[155px] px-[20px] flex justify-between items-center bg-[#191919] cursor-pointer hover:border hover:border-[#9B51E0] ${
                    idx === buttoncolor ? "border border-[#9B51E0]" : ""
                  } rounded-lg`}
                  key={data?.id}
                  onClick={() => handleButtonClick(data.id)}
                >
                  <div className="lg:w-[65%] h-[80px] flex flex-col gap-2">
                    <div className="text-[#ffffff] text-[20px] text-roboto font-[500]">
                      {data?.assetsName}
                    </div>
                    <div className="text-[#ffffff] text-[14px] text-roboto font-[400]">
                      {data?.assetsValue}
                    </div>
                  </div>
                  <div className="w-[86px] h-[86px]">
                    <img src={data.imageSrc} alt="" />
                  </div>
                </div>
              ))}
              {modalIsOpen ? (
                <AssetsModal2
                  isModalOpen={modalIsOpen}
                  open={handleButtonClick}
                  handleClose={closeModal}
                  setIsOpen={setIsOpen}
                  assetId={assetId}
                />
              ) : (
                ""
              )}
              {modOPen ? (
                <AddAssetsSuccessModal
                  isSuccessModalOpen={successModalOpen}
                  textData={modalText ? modalText : "Asset Added Successfully"}
                  // textData={'Asset Added Successfully'}
                  SuccessModalopen={handleFileUploadModal}
                  handleSuccessClose={closeSuccessModal}
                  // assetId={assetId}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AddAssets;

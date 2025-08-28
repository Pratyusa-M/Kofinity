/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import righttick from "../../assets/righttick.svg";
import fileuploadsuccess from "../../assets/fileuploadsuccess.svg";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
// import AssetSelect from "../../components/addAssets/assestSelect";
import AssetButton from "../../components/addAssets/assetButton";
import RealEstateSelect from "../../components/addAssets/realEstateSelect";
import CrossIcon from "../../assets/cross-icon.png";
import DummySelect from "../../components/common/dummyInput";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    border: "none",
    backgroundColor: "transparent",
    zIndex: 9999,
  },
  overlay: {
    backgroundColor: "rgb(8 8 8 / 75%)",
    zIndex: 9998,
  },
};

const EditSelectBankAccountModal = ({
  isSuccessModalOpen2,
  SuccessModalopen,
  handleSuccessClose2,
  setsuccessModalOpen1,
  banksData,
}) => {
  const [selectedOpt, setSelectedOpt] = useState();
  const navigate = useNavigate();

  const options = [
    { id: 1, opt: "bank 1" },
    { id: 2, opt: "bank 2" },
    { id: 3, opt: "bank 3" },
  ];

  const getSelectedOpt = (optId) => {
    setSelectedOpt(optId);
  };

  const onClickContinue = () => {
    if (selectedOpt) {
      handleSuccessClose2();
      setsuccessModalOpen1(true);
      navigate("/editrealestate3");
    } else {
      navigate("/addbankaccount2", { state: { isOpenRealEstate: true } });
    }
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  return (
    <Modal
      isOpen={isSuccessModalOpen2}
      onRequestClose={handleSuccessClose2}
      style={customStyles}
    >
      {isSuccessModalOpen2 && (
        <>
          <div className="w-[300px] sm:w-[500px] md:w-[724px] p-4 h-[349px] rounded-[10px] bg-[#191919]  flex flex-col items-center">
            <button onClick={handleSuccessClose2} className="self-end">
              <img src={CrossIcon} alt="cross" />
            </button>
            <div className="flex flex-col gap-7 w-[90%] mt-10">
              <label className="text-roboto font-[500] text-[24px] text-[#ffffff]">
                Select Bank
              </label>
              <div>
                {banksData?.length > 0 ? (
                  <RealEstateSelect
                    data={banksData}
                    placeholder={"Select Bank"}
                    getSelectedOpt={getSelectedOpt}
                  />
                ) : (
                  loadingDummyInput("Select Bank")
                )}
              </div>
              <div className="self-end mt-3">
                <AssetButton disabled={false} onClick={onClickContinue}>
                  CONTINUE
                </AssetButton>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
export default EditSelectBankAccountModal;

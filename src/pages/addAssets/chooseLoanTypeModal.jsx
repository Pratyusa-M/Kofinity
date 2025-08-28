/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import righttick from "../../assets/righttick.svg";
import fileuploadsuccess from "../../assets/fileuploadsuccess.svg";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
// import AssetSelect from "../../components/addAssets/assestSelect";
import RealEstateSelect from "../../components/addAssets/realEstateSelect";
import LoanTypeSelect from "../../components/addAssets/loanTypeSelect";
import AssetButton from "../../components/addAssets/assetButton";
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
    zIndex: 9998
  },
};

const ChooseLoanTypeModal = ({
  isSuccessModalOpen1,
  SuccessModalopen,
  handleSuccessClose1,
  textData,
  loanTypeData,
  setLoanId,
  setLoanBankName,
  loanId,
}) => {
  const [selectedOpt, setSelectedOptId] = useState();
  const [selectedBankName, setSelectedBankname] = useState("");
  const navigate = useNavigate();

  const getSelectedOpt = (optId) => {
    setSelectedOptId(optId);
  };

  const onClickContinue = () => {
    handleSuccessClose1();
    // if (selectedOpt){
    //     handleSuccessClose1()
    //     navigate('/addrealestate3')
    // }
    // else{
    //     navigate('/adddebt',{ state: { debtRoute:'/addrealestate3' } })
    // }
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
      isOpen={isSuccessModalOpen1}
      onRequestClose={handleSuccessClose1}
      style={customStyles}
    >
      {isSuccessModalOpen1 && (
        <>
          <div className="w-[300px] sm:w-[500px] md:w-[724px] p-4 h-[349px] rounded-[10px] bg-[#191919]  flex flex-col items-center z-50">
            <button onClick={handleSuccessClose1} className="self-end">
              <img src={CrossIcon} alt="cross" />
            </button>
            <div className="flex flex-col gap-7 w-[90%] mt-10">
              <label className="text-roboto font-[500] text-[24px] text-[#ffffff]">
                {/* Choose Loan Type */}
                Choose Loan
              </label>
              <div>
                {loanTypeData?.length > 0 ? (
                  <LoanTypeSelect
                    data={loanTypeData}
                    placeholder={"Select Loan"}
                    getSelectedOpt={getSelectedOpt}
                    setLoanId={setLoanId}
                    setBankName={setLoanBankName}
                  />
                ) : (
                  loadingDummyInput("Select Loan")
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
export default ChooseLoanTypeModal;

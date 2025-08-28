/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import righttick from "../../assets/righttick.svg";
import fileuploadsuccess from "../../assets/fileuploadsuccess.svg";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

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

const AddAssetsSuccessModal = ({
  isSuccessModalOpen,
  SuccessModalopen,
  handleSuccessClose,
  textData,
}) => {
  const navigate = useNavigate();

  //   useEffect(() => {
  //     setTimeout(() => {
  //       handleSuccessClose();
  //       navigate("/");
  //     }, 4000);
  //   });

  return (
    <Modal
      isOpen={isSuccessModalOpen}
      onRequestClose={handleSuccessClose}
      style={customStyles}
    >
      {isSuccessModalOpen && (
        <>
          <div className="w-[300px] sm:w-[513px] flex items-center justify-center h-[220px] rounded-[10px] bg-[#191919]">
            <div className="flex flex-col justify-center items-center gap-0 p-0">
              <div className="flex flex-col gap-0">
                <div className="w-[56px] h-[71px] ">
                  <img src={fileuploadsuccess} alt="fileIcon" />
                </div>
                <div className="w-[27px] relative left-8 bottom-5 h-[27px]">
                  <img src={righttick} alt="rightIcon" />
                </div>
              </div>
              <div className="text-[24px] text-roboto font-[500] text-[#FFFFFF] self-center sm:ml-0">
                {textData}
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
export default AddAssetsSuccessModal;

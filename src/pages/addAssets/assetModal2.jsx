/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import Modal from "react-modal";
import Vector from "../../assets/Vector.png";
import fileicon from "../../assets/fileicon.png";
import closeicons from "../../assets/closeicons.png";
import ErrorOutline from "../../assets/ErrorOutline.png";
import crossicon from "../../assets/crossicon.png";
import { useNavigate } from "react-router-dom";
import AuthButton from "../../components/auth/authButton";
import FileUpload from "./FileUpload";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import LoadingButton from "../../components/auth/LoadingButton";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";
import { useSelector } from "react-redux";

const customStyles = {
  content: {
    top: "50%",
    left: "49%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    border: "none",
    backgroundColor: "transparent",
  },
  overlay: {
    backgroundColor: "rgb(8 8 8 / 75%)",
  },
};

console.log(import.meta.env.XLSX_FILE_URL);
const XLSX_FILE_URL = import.meta.env.XLSX_FILE_URL;

const AssetsModal2 = ({
  isModalOpen,
  open,
  handleClose,
  setIsOpen,
  assetId,
}) => {
  const [formValue, setFormValue] = useState();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [bankAccountsData, setBankAccountsData] = useState([]);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);


  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  if (isModalOpen) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // html tag
  } else {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };
}, [isModalOpen]);

useEffect(() => {
  const fetchBankAccounts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBankAccountsData(response?.data?.data);
      console.log(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  fetchBankAccounts();
}, [selectedCurrencyId]);


  console.log(formValue?.csvFile?.type, "csv file typeee");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFormValue({ csvFile: file });
      setErrorMessage(null);
    } else {
      setFormValue(null);
      setErrorMessage(
        "Format not supported. Please choose the .xlsx file format."
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (assetId === 0) {
      handleSubmit1("stocks/xlsx/upload");
    } else if (assetId === 4) {
      handleSubmit1("other-asset/xlsx/upload");
    } else if (assetId === 1) {
      handleSubmit1("real-estate/xlsx/upload");
    } else if (assetId === 2) {
      handleSubmit1("crypto/xlsx/upload");
    }
  };

  const handleSubmit1 = async (url) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (formValue) {
      try {
        const formData = new FormData();
        formData.append("file", formValue.csvFile);
        const response = await axios.post(`${baseUrl}` + url, formData, {
          onUploadProgress: (ProgressEvent) => {
            console.log(ProgressEvent.progress, "p eventtt");
          },
          headers: {
            //  "Custom-Header":"value",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        // console.log(response);
        const successMessage =
          typeof response?.data?.message === "string"
            ? response?.data?.message
            : "Successfully Logged in";
        toast.success(successMessage, {});
        setLoading(false);
        setSuccessModalOpen(true);
      } catch (error) {
        console.log(error?.response?.data?.message);
        const errorMessage =
          typeof error?.response?.data?.message === "string"
            ? error?.response?.data?.data?.errors[0]?.error
            : "Login failed";
        toast.error(errorMessage, {});
        console.log(error?.response?.data?.data?.errors , "errorrrr");
        if (error?.response?.data?.data?.errors[0]?.error ===  "Validation error") {
          error?.response?.data?.data?.errors[0]?.details?.errors?.forEach((error) => {
            toast.error(error);
          });
        }
        setLoading(false);
      }
    }
  };

  const handleFileClick = () => {
    // setDropPageShow(!isDropPageShow)
    if(bankAccountsData.length < 1) {
      toast.error("Please add a bank account before uploading a file", {});
      return;
    }
    inputRef.current?.click();
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  const downloadStocksSampleTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}xlsx/stocks/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const downloadRealEstateSampleTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}xlsx/real-estate/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const downloadCryptoSampleTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}xlsx/crypto/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const downloadOtherAssetSampleTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}xlsx/other-asset/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const downloadSampleTemplate = () => {
    if (assetId === 0) {
      downloadStocksSampleTemplate();
    } else if (assetId === 1) {
      downloadRealEstateSampleTemplate();
    } else if (assetId === 2) {
      downloadCryptoSampleTemplate();
    } else if (assetId === 3) {
      // downloadBankSampleTemplate()
    } else if (assetId === 4) {
      downloadOtherAssetSampleTemplate();
    }
  };

  const onNavigateAddAssets = () => {
    if (assetId === 0) {
      navigate("/addstocks");
    } else if (assetId === 4) {
      navigate("/addotherassets");
    } else if (assetId === 1) {
      navigate("/addrealestate1");
    } else if (assetId === 2) {
      navigate("/addcrypto");
    } else if (assetId === 3) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/addAssets" } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    containerRef.current.classList.add("dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    containerRef.current.classList.remove("dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    containerRef.current.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFormValue({ csvFile: file });
      setErrorMessage(null);
    } else {
      setFormValue(null);
      setErrorMessage(
        "Format not supported. Please choose the .xlsx file format."
      );
    }
  };

  const closeSelectedFile = () => {
    setFormValue({ csvFile: null });
    setSubmitted(true);
  };

  const LoadingButton = () => {
    // eslint-disable-next-line react/prop-types

    return (
      <button
        className="w-[100%] min-w-[115px] h-[42px] text-white text-base font-medium uppercase rounded-[50px] flex-col justify-center items-center inline-flex bg-zinc-500"
        disabled={true}
      >
        <TailSpin
          height="20"
          width="20"
          color="white"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </button>
    );
  };

  return (
    <>
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        style={customStyles}
      >
        {isModalOpen && !successModalOpen && (
          <>
            <div
              ref={containerRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="w-[300px] sm:w-[620px] md:w-[650px] lg:w-[720px] h-[675px] sm:h-[660px] bg-[#191919] bg-opacity-95 p-1 overflow-auto overflow-x-hidden ff-scroll rounded drop-shadow "
            >
              <div className="flex justify-end">
                <div
                  className="flex w-[20px] h-[20px] self-end mt-6 absolute top-[1px] right-4 sm:right-4 cursor-pointer "
                  onClick={handleClose}
                >
                  <img src={crossicon} alt="closeIcon" />
                </div>
              </div>
              <div className="flex flex-col sm:w-[550px] lg:w-[627px] h-[547px]">
                <div className="flex items-center gap-0 sm:gap-3  p-4 mt-14 ml-0 sm:ml-6">
                  <p className="text-[#ffffff] text-[24px] text-roboto font-[500]">
                    Upload CSV File here
                  </p>
                  <div
                    className=" w-[130px] sm:w-[195px]  bg-[#BDBDBD] text-[#383838] text-[14px] text-roboto font-[500] text-center mt-0 sm:mt-1 cursor-pointer rounded-[2px]"
                    onClick={downloadSampleTemplate}
                  >
                    Download sample template
                  </div>
                </div>
                {errorMessage && (
                  <div className="w-[280px] sm:w-[482px] h-[40px] flex justify-between items-center rounded mb-4 ml-2 sm:ml-10 p-6 sm:p-2 bg-[#F44336]">
                    <div className="flex justify-start items-center gap-3 sm:gap-1 ">
                      <div className="w-[22px] flex items-center h-[36px]">
                        <img src={ErrorOutline} alt="file" />
                      </div>
                      <div className=" w-[250px] sm:w-[416px] flex flex-wrap items-center h-[54px] sm:h-[36px] text-[#FFFFFF] text-[16px] text-roboto font-[400] ">
                        {errorMessage}
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="w-[270px] sm:w-full h-[260px] rounded-[12px] border-[1.5px] border-dashed border-[#5F5F5F] bg-[#191919] bg-opacity-40 ml-3 sm:ml-9">
                    {formValue?.csvFile?.type ==
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                      <div className="h-[41px] flex justify-between items-center bg-[#6B6B6B] m-4 rounded-[4px] ">
                        <div className="flex justify-start items-center mb-1 gap-1 pl-2">
                          <div className="w-[26px] h-[21px]">
                            <img src={fileicon} alt="file" />
                          </div>
                          <div className=" h-[19px] text-[16px] text-roboto font-[400] text-[#C9C9C9]">
                            {formValue?.csvFile?.name}
                          </div>
                        </div>
                        <div className="flex justify-end items-center mt-1">
                          <div
                            className="w-[26px] h-[21px] self-end"
                            onClick={closeSelectedFile}
                          >
                            <img src={closeicons} alt="crossicon" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 justify-center items-center mt-11">
                        <div className="w-[43px] h-[54px]">
                          <img src={Vector} alt="UploadText" />
                        </div>
                        <p className=" text-[#5C5C5C] text-[20px] text-roboto font-[400] mt-1">
                          Drag & drop your CSV file here
                        </p>
                        <p className=" text-[#5C5C5C] text-[20px] text-roboto font-[400]">
                          Or
                        </p>
                        <div
                          className="text-[#9B51E0] text-[20px] text-roboto font-[400] cursor-pointer "
                          onClick={handleFileClick}
                        >
                          Browse File
                        </div>
                        <input
                          id="csvFile"
                          name="csvFile"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                          ref={inputRef}
                        />
                      </div>
                    )}
                  </div>
                  <div className="ml-[6px] sm:ml-10 mt-6 w-[280px] sm:w-full h-[45px] text-[20px] flex justify-center items-center text-[#F6F8FB] font-[500] text-roboto rounded-full">
                    {isLoading ? (
                      LoadingButton()
                    ) : (
                      <AuthButton
                        disabled={formValue?.csvFile?.type === undefined}
                        isMaxWidth={true}
                        isMaxHeight={true}
                        type="submit"
                      >
                        Upload
                      </AuthButton>
                    )}
                  </div>
                </form>
                <div className="w-full h-6 justify-center items-center inline-flex mt-8 -ml-1 sm:ml-10">
                  <div className="w-[90px] sm:w-[290px] h-px relative bg-[#5F5F5F] bg-opacity-40" />
                  <div className="flex-col justify-center items-center inline-flex">
                    <div
                      className={`w-[36px] h-[36px] text-center text-roboto text-[14px] font-[400] leading-normal m-5 text-[#5F5F5F] text-opacity-70 border border-[#5F5F5F] rounded-[50%] p-2`}
                    >
                      OR
                    </div>
                  </div>
                  <div className="w-[90px] sm:w-[290px] h-px relative bg-[#5F5F5F] bg-opacity-40" />
                </div>

                <div
                  onClick={onNavigateAddAssets}
                  className="ml-[6px] sm:ml-9 mt-8 w-[280px] sm:w-full h-[36x] text-[21px] text-center text-[#383838] font-[500] text-roboto bg-[#F6F8FB] rounded-full p-1 sm:p-2 cursor-pointer tracking-tight-[0.5px]"
                >
                  <div>ADD MANUALLY</div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
      {successModalOpen && (
        <FileUpload
          isSuccessModalOpen={successModalOpen}
          SuccessModalopen={handleSubmit}
          handleSuccessClose={handleCloseSuccessModal}
          textData={"File Uploaded Successfully"}
        />
      )}
    </>
  );
};

export default AssetsModal2;

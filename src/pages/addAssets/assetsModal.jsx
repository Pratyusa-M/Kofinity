/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Modal from "react-modal";
import Vector from "../../assets/Vector.png";
import fileicon from "../../assets/fileicon.png";
import closeicons from "../../assets/closeicons.png";
import ErrorOutline from "../../assets/ErrorOutline.png";
import crossicon from "../../assets/crossicon.png";
import { useNavigate } from "react-router-dom";
import AuthButton from "../../components/auth/authButton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import FileUpload from "./FileUpload";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useFormikContext } from "formik";

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

console.log(import.meta.env.CSV_FILE_URL);
const CSVFILE_URL = import.meta.env.CSV_FILE_URL;

const AssetsModal = ({
  isModalOpen,
  open,
  handleClose,
  setIsOpen,
  assetId,
}) => {
  const [formValue, setFormValue] = useState();
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const formik = useFormikContext();

  const initialValues = {
    csvFile: null,
  };
  const modalSchema = Yup.object({
    csvFile: Yup.mixed()
      .required("Please select a file")
      .test(
        "fileFormat",
        "Format not supported. Please choose the .csv file format.",
        (value) => {
          if (value) {
            const supportedFormats = ["csv"];
            return supportedFormats.includes(value.name.split(".").pop());
          }
          return true;
        }
      ),
  });

  // const handleSubmit = async (values) => {
  //   setsuccessModalOpen(true);
  // };

  const readCsvFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    // console.log(values.csvFile, 'csv filee')

    try {
      const fileContent = await readCsvFile(formValue?.csvFile);
      const response = await axios.post(
        `${baseUrl}/stocks/upload`,
        {
          file: values?.csvFile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setsuccessModalOpen(true);
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const closeSuccessModal = () => {
    setsuccessModalOpen(false);
  };

  const handleFileClick = () => {
    inputRef.current?.click();
  };

  const handleclose = () => {
    handleClose();
  };

  const downloadStocksSampleTemplate = async () => {
    try {
      // Fetch the authorization token from your backend or authentication service
      const token = localStorage.getItem("token");

      // Make a request with authorization header using Axios
      const response = await axios.get(`${baseUrl}xlsx/stocks/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert the response to blob
      const blob = new Blob([response.data]);

      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.csv"; // Set desired filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const downloadOtherAssetSampleTemplate = async () => {
    try {
      // Fetch the authorization token from your backend or authentication service
      const token = localStorage.getItem("token");

      // Make a request with authorization header using Axios
      const response = await axios.get(`${baseUrl}xlsx/other-asset/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert the response to blob
      const blob = new Blob([response.data]);

      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.csv"; // Set desired filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const downloadRealEstateSampleTemplate = async () => {
    try {
      // Fetch the authorization token from your backend or authentication service
      const token = localStorage.getItem("token");

      // Make a request with authorization header using Axios
      const response = await axios.get(`${baseUrl}xlsx/real-estate/template`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Convert the response to blob
      const blob = new Blob([response.data]);

      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.csv"; // Set desired filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const downloadSampleTemplate = () => {
    if (assetId === 0) {
      downloadStocksSampleTemplate();
    } else if (assetId === 1) {
      downloadRealEstateSampleTemplate();
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

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   containerRef.current.classList.remove("dragover");
  //   const file = e.dataTransfer.files[0];
  //   console.log(file)
  //   setFormValue({ csvFile: file });
  // };
  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   containerRef.current.classList.remove("dragover");
  //   const file = e.dataTransfer.files[0];
  //   console.log(file);
  //   if (file.type !== "text/csv") {
  //     // Set an error for the csvFile field
  //      setFormValue(null); // Clear the form value
  //     formik.setFieldValue("csvFile", null); // Clear the form field
  //     formik.setFieldError("csvFile", "Format not supported. Please choose the .csv file format."); // Set the error message for the csvFile field
  //   } else {
  //     setFormValue({ csvFile: file });
  //     formik.setFieldValue("csvFile", file);
  //   }
  // };
  const handleDrop = (e) => {
    e.preventDefault();
    containerRef.current.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setFormValue({ csvFile: file });
      formik.setFieldValue("csvFile", file);
      formik.setFieldError("csvFile", null); // Clear the error message
    } else {
      formik.setFieldValue("csvFile", null); // Clear the form field
      formik.setFieldError(
        "csvFile",
        "Format not supported. Please choose the .csv file format."
      );
    }
  };

  return (
    <>
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
                  onClick={handleclose}
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
                    className=" w-[130px] sm:w-[195px] h-[40px] sm:h-[20px] bg-[#BDBDBD] text-[#383838] text-[14px] text-roboto font-[500] text-center mt-0 sm:mt-1 cursor-pointer rounded-[2px]"
                    onClick={() => {
                      // downloadFileAtUrl(CSVFILE_URL);
                      downloadSampleTemplate();
                    }}
                  >
                    Download sample template
                  </div>
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={modalSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    errors,
                    touched,
                    handleBlur,
                    setFieldValue,
                    values,
                    isSubmitting,
                  }) => (
                    <Form>
                      {errors.csvFile && (
                        <div className="w-[280px] sm:w-[482px] h-[40px] flex justify-between items-center rounded mb-4 ml-2 sm:ml-10 p-6 sm:p-2 bg-[#F44336]">
                          <div className="flex justify-start items-center gap-3 sm:gap-1 ">
                            <div className="w-[22px] flex items-center h-[36px]">
                              <img src={ErrorOutline} alt="file" />
                            </div>
                            <div className=" w-[250px] sm:w-[416px] flex flex-wrap items-center h-[54px] sm:h-[36px] text-[#FFFFFF] text-[16px] text-roboto font-[400] ">
                              {errors.csvFile}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="w-[270px] sm:w-full h-[260px] rounded-[12px] border-[1.5px] border-dashed border-[#5F5F5F] bg-[#191919] bg-opacity-40 ml-3 sm:ml-9">
                        {formValue?.csvFile?.type == "text/csv" ? (
                          <div className="h-[41px] flex justify-between items-center bg-[#6B6B6B] m-4 rounded-[4px] ">
                            <div className="flex justify-start items-center mb-1 gap-1 pl-2">
                              <div className="w-[26px] h-[21px]">
                                <img src={fileicon} alt="file" />
                              </div>
                              <div className="w-[50px] h-[19px] text-[16px] text-roboto font-[400] text-[#C9C9C9]">
                                {formValue?.csvFile?.name}
                              </div>
                            </div>
                            <div className="flex justify-end items-center mt-1">
                              <div className="w-[26px] h-[21px] self-end">
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
                              onChange={(event) =>
                                setFieldValue("csvFile", event.target.files[0])
                              }
                              style={{ display: "none" }}
                              onBlur={handleBlur}
                              className={`mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                                touched.csvFile && errors.csvFile
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              ref={inputRef}
                            />
                          </div>
                        )}
                      </div>
                      <div className="ml-[6px] sm:ml-10 mt-6 w-[280px] sm:w-full h-[45px] text-[20px] flex justify-center items-center text-[#F6F8FB] font-[500] text-roboto rounded-full">
                        <AuthButton
                          disabled={
                            formValue?.csvFile === null || errors?.csvFile
                          }
                          isMaxWidth={true}
                          isMaxHeight={true}
                        >
                          Upload
                        </AuthButton>
                      </div>
                      <AutoSubmitToken setFormValue={setFormValue} />
                    </Form>
                  )}
                </Formik>
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
      {successModalOpen ? (
        <FileUpload
          isSuccessModalOpen={successModalOpen}
          SuccessModalopen={handleSubmit}
          handleSuccessClose={closeSuccessModal}
          textData={"File Uploaded Successfully"}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default AssetsModal;

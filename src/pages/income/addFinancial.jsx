/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import incomecalculator from "../../assets/incomecalculator.png";
import incomecard from "../../assets/incomecard.svg";
import incomewallet from "../../assets/incomewallet.png";
import closeicon from "../../assets/closeicon.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const financialData = [
  {
    id: 0,
    assetsName: "Income",
    imageSrc: incomewallet,
    assetsValue: "Add your income sources and link them to keep track.",
  },
  {
    id: 1,
    assetsName: "Expense",
    imageSrc: incomecalculator,
    assetsValue: "Add your expense sources and link them to keep track.",
  },
  {
    id: 2,
    assetsName: "Debt",
    imageSrc: incomecard,
    assetsValue: "Add your expense sources and link them to keep track.",
  },
];

const AddFinancial = () => {
  const [buttoncolor, setbuttoncolor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("incomeFormData");
    localStorage.removeItem("incomeDropdownData");
    localStorage.removeItem("expenseFormData");
    localStorage.removeItem("expenseDropdownData");
    localStorage.removeItem("debtDropdownData");
  }, []);

  const naviagteToHome = () => {
    navigate("/allassets");
  };

  const handleButtonClick = async (buttonId) => {
    setbuttoncolor(buttonId);
    if (buttonId === 0) {
      navigate("/addincome");
    } else if (buttonId === 1) {
      navigate("/addexpense");
    } else if (buttonId === 2) {
      navigate("/adddebt", { state: { debtRoute: "/addfinancial" } });
    }
  };

  return (
    <>
      <div className="w-full min-h-[100vh] bg-[#121212] flex flex-col items-center">
        <div className="self-end">
          <div
            className="flex w-[78px] h-[24px] self-end mt-6 mr-8 cursor-pointer"
            onClick={naviagteToHome}
          >
            <img src={closeicon} alt="closeIcon" />
          </div>
        </div>

        <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] flex flex-col justify-center mt-20 mb-10">
          <h1 className=" text-[#ffffff] text-[24px] text-roboto font-[500] mb-10">
            Add Financials
          </h1>

          <div className="flex flex-wrap gap-[40px] lg:gap-[60px]">
            {financialData.map((data, idx) => (
              <div
                className={`w-[100%] lg:w-[45%] h-[155px] px-[20px] flex justify-between items-center bg-[#191919] cursor-pointer hover:border hover:border-[#9B51E0] ${
                  idx === buttoncolor ? "border border-[#9B51E0]" : ""
                } rounded-lg`}
                key={data?.id}
                onClick={() => handleButtonClick(data.id)}
              >
                <div className=" lg:w-[65%] h-[80px] flex flex-col gap-2">
                  <div className="text-[#ffffff] text-[20px] text-roboto font-[500]">
                    {data?.assetsName}
                  </div>
                  <div className="text-[#A8A8A8] text-[14px] text-roboto font-[400] tracking-[0.15px]">
                    {data?.assetsValue}
                  </div>
                </div>
                <div className="w-[86px] h-[86px]">
                  <img src={data.imageSrc} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default AddFinancial;

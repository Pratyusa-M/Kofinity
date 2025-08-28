/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import CancelIcon from "../../assets/cancel.png";
import BackArrow from "../../assets/arrow-back.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAddDebtFormData } from "../../redux/store/slice/addFinancialsSlice";

const AssetLayout = ({
  jsxProp,
  heading,
  backRoute,
  closeRoute,
  isRealEstate,
  barWidth,
  isSellAssets,
  onClick,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const onNavigateAssets = () => {
    // localStorage.removeItem("formData1");
    // localStorage.removeItem("formData2");
    // localStorage.removeItem("formData3");
    if (location.pathname === "/adddebt") {
      dispatch(setAddDebtFormData({}));
    }
    navigate(closeRoute);
  };

  const onClickBack = () => {
    if (location.pathname === "/adddebt") {
      dispatch(setAddDebtFormData({}));
    }
    navigate(backRoute);
  };

  return (
    <div className="bg-[#121212] min-w-[100vw] min-h-[100vh] pt-7 px-2 md:px-7 sm:px-[60px] sm:py-[32px]  flex flex-col">
      <div className="flex justify-between flex-wrap">
        {!isSellAssets ? (
          <button
            onClick={onClickBack}
            className="flex items-center gap-2 text-[#5D5D5D] bg-transparent text-[16px] font-[500] text-roboto"
          >
            <img src={BackArrow} alt="back-arrow" />
            Back
          </button>
        ) : (
          <div></div>
        )}
        <div className="hidden sm:block">
          <div className="flex items-center gap-4 ">
            <h1 className="text-[#ffffff] text-[20px] font-[500] text-roboto ">
              {heading}
            </h1>
            {isRealEstate && (
              <div className="flex items-center gap-3">
                <p className="text-[#6FCF97] text-[16px] font-[400] text-roboto">
                  Step {barWidth}
                </p>
                {barWidth === "1/3" && (
                  <div className="w-[60px]  h-[4px] bg-white">
                    <div className={`w-1/3 h-[100%] bg-[#6ccc94]`}></div>
                  </div>
                )}
                {barWidth === "2/3" && (
                  <div className="w-[60px]  h-[4px] bg-white">
                    <div className={`w-2/3 h-[100%] bg-[#6ccc94]`}></div>
                  </div>
                )}
                {barWidth === "3/3" && (
                  <div className="w-[60px]  h-[4px] bg-white">
                    <div className={`w-full h-[100%] bg-[#6ccc94]`}></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onNavigateAssets}
          type="button"
          className="flex items-center gap-1 mr-0 text-[#5D5D5D] text-[16px] font-[500] text-roboto"
        >
          <img alt="cancel" src={CancelIcon} />
          <span>Close</span>
        </button>
      </div>
      <div className=" flex flex-col items-center gap-4 sm:hidden ">
        <h1 className="text-[#ffffff] text-[20px] font-[500] text-roboto  sm:hidden  mt-10">
          {heading}
        </h1>
        {isRealEstate && (
          <div className="flex items-center gap-3">
            <p className="text-[#6FCF97] text-[16px] font-[400] text-roboto">
              Step {barWidth}
            </p>
            {barWidth === "1/3" && (
              <div className="w-[60px]  h-[4px] bg-white">
                <div className="w-1/3 h-[100%] bg-[#6ccc94]"></div>
              </div>
            )}
            {barWidth === "2/3" && (
              <div className="w-[60px]  h-[4px] bg-white">
                <div className="w-2/3 h-[100%] bg-[#6ccc94]"></div>
              </div>
            )}
            {barWidth === "3/3" && (
              <div className="w-[60px]  h-[4px] bg-white">
                <div className="w-full h-[100%] bg-[#6ccc94]"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-[95%] md:w-[80%] self-center mt-[50px] md:mt-[65px]">
        {jsxProp}
      </div>
    </div>
  );
};

export default AssetLayout;

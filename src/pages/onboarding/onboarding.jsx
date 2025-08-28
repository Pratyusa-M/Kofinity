import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../components/layout/authLayout";
import Question from "../../components/onboarding/question";
import RangeBar from "../../components/onboarding/rangeBar";
import Checkbox from "../../components/onboarding/checkbox";
import AuthButton from "../../components/auth/authButton";
import PrevButton from "../../components/onboarding/prevButton";
import LoadingButton from "../../components/auth/LoadingButton";
import axios from "axios";
import {
  setCurrentQuestionIndex,
  setSelectedOptions,
  addToAllSelectedData,
  setOnboardingData,
} from "../../redux/store/slice/onboardingSlice";
import { baseUrl } from "../../utils/baseUrl";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";

const Onboarding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const {
    currentQuestionIndex,
    selectedOptions,
    allSelectedData,
    onboardingData,
  } = useSelector((state) => state.onboarding);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOnboardingData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}question/get/ONBOARDING`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        dispatch(setOnboardingData(response?.data?.data));
      } catch (error) {
        console.error("Error fetching on onboarding data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getOnboardingData();
  }, []);

  const sendingSelectedItems = async () =>{
    
    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      const response = await axios.post(`${baseUrl}question/answers/`, {
        answers: allSelectedData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      const successMessage = 
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Onboarding completed successfully";
      console.log(successMessage, 'success message')
      toast.success(successMessage, {});
      setTimeout(() => {
        navigate("/");
      }
      , 2000);
    } catch (error) {
      console.error("Error fetching on onboarding sending data:", error);
      setIsSubmitting(false);
      setIsSubmitted(false);
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Failed to complete onboarding";
      toast.error(errorMessage, {});
      console.error("Onboarding submission failed:", error);
    } 
  }

  useEffect(() => {
    console.log("All Selected Data:", allSelectedData);
  });

  const handleCheckboxClick = (optionId) => {
    dispatch(
      setSelectedOptions({ questionIndex: currentQuestionIndex, optionId })
    );
    // dispatch(addToAllSelectedData({ questionId: onboardingData[currentQuestionIndex].id, optionId }));
  };

  const handleContinueClick = () => {
    if (currentQuestionIndex < onboardingData.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
      dispatch(
        addToAllSelectedData({
          questionId: onboardingData[currentQuestionIndex].id,
          optionId: selectedOptions[currentQuestionIndex],
        })
      );
    } else {
      dispatch(
        addToAllSelectedData({
          questionId: onboardingData[currentQuestionIndex].id,
          optionId: selectedOptions[currentQuestionIndex],
        })
      );

      sendingSelectedItems()
    }
  };

  const handlePrevClick = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
    }
  };

  const handleSkipClick = () => {
    if (currentQuestionIndex < onboardingData.length - 1) {
      //  dispatch(addToAllSelectedData({ questionId: onboardingData[currentQuestionIndex].id, optionId: null }));
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
    else{
      navigate("/");
    }
  };

  const calculateRangeBarWidth = () => {
    return `${currentQuestionIndex + 1}/${onboardingData.length}`;
  };

  return (
    <AuthLayout
      jsxProp={
        <>
          {isLoading ? (
            <TailSpin
              height="40"
              width="40"
              color="white"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            <div className="w-[100%] flex flex-col gap-3 -ml-1">
              <Question>
                {onboardingData[currentQuestionIndex]?.question}
              </Question>
              <div className="flex justify-between items-center">
                <RangeBar
                  width={calculateRangeBarWidth()}
                  pageNo={currentQuestionIndex + 1}
                  totalPages={onboardingData.length}
                />
                <button
                  type="button"
                  className="bg-transparent underline mr-0 sm:mr-7 text-roboto text-[16px] font-[400] text-[#ffffff] text-opacity-70"
                  onClick={handleSkipClick}
                >
                  Skip
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {onboardingData[currentQuestionIndex]?.question_Option?.map(
                  (option) => (
                    <Checkbox
                      key={option.id}
                      optionText={option.option}
                      isSelected={
                        selectedOptions[currentQuestionIndex] === option.id
                      }
                      onClick={() => handleCheckboxClick(option.id)}
                    />
                  )
                )}
              </div>
              <div className="flex justify-between items-center mr-2 sm:mr-6 mt-6">
                {currentQuestionIndex > 0 && (
                  <PrevButton onClick={handlePrevClick}>PREVIOUS</PrevButton>
                )}
                <div className="flex w-full justify-end">
                  <div className="w-[100px] sm:w-[121px] self-end">
                    {isSubmitting ? (
                      <LoadingButton />
                    ) : (
                    <AuthButton
                      onClick={() => handleContinueClick()}
                      disabled={
                        selectedOptions[currentQuestionIndex] === undefined ||
                        selectedOptions[currentQuestionIndex] === null ||
                        isSubmitted
                      }
                    >
                      {currentQuestionIndex === onboardingData.length - 1
                        ? "Finish"
                        : "Continue"}
                    </AuthButton>)}
                  </div>
                </div>
              </div>
            </div>
          )}
          <ToastContainer/>
          
        </>
      }
    />
  );
};

export default Onboarding;

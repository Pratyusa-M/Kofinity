import AuthLayout from "../../components/layout/authLayout";
import SuccessCircle from "../../assets/check-circle.png";
import AuthButton from "../../components/auth/authButton";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/signin");
  };

  return (
    <AuthLayout
      jsxProp={
        <div className="flex flex-col items-center ml-3 mt-5 gap-7 mr-6 sm:ml-0 ">
          <img alt="success" src={SuccessCircle} />
          <div className="flex flex-col items-center gap-2">
            <h1
              className={`text-2xl font-semibold text-roboto  leading-[30px] tracking-[0.9px] 
              text-white
            `}
            >
              Success!!
            </h1>
            <p
              className={`w-[105%] opacity-70 text-[16px] font-normal leading-[30px] tracking-[0.15px] text-roboto text-center text-white`}
            >
              Your password has been updated. Please proceed to the login page.
            </p>
          </div>
          <div className="w-[100%] mt-4">
            <AuthButton disabled={false} onClick={redirect}>
              Continue
            </AuthButton>
          </div>
        </div>
      }
    />
  );
};

export default Success;

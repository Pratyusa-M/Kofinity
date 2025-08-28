import AuthLayout from "../../components/layout/authLayout";
import AuthButton from "../../components/auth/authButton";
import EmailIcon from "../../assets/email.png";
import { useNavigate } from "react-router-dom";

const EmailSent = () => {
  const navigate = useNavigate();

  const naviagteTologin = () => {
    navigate("/signin");
  };

  return (
    <AuthLayout
      jsxProp={
        <div className="flex flex-col items-center mr-1 gap-5 mt-5 text-roboto sm:mr-0 sm:-ml-7">
          <img src={EmailIcon} alt="email" />
          <h1 className="text-white text-[24px] font-[700] tracking-[0.9px]">
            Sent!!
          </h1>
          <p className="w-[87%] text-center text-white text-opacity-70 text-[16px] mb-5 tracking-[0.5px]">
            A password reset link has been sent to your email please click on
            the link to reset password.
          </p>
          <AuthButton disabled={false} onClick={naviagteTologin}>
            GO TO LOGIN
          </AuthButton>
        </div>
      }
    />
  );
};

export default EmailSent;

import Logo from "../auth/logo";
import BgImage from "../../assets/BG.png";

// eslint-disable-next-line react/prop-types
const AuthLayout = ({ jsxProp }) => {

  return (
    <div
      className={`min-w-screen min-h-screen flex flex-col justify-center items-center gap-3 bg-[#1D232C]`}
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Logo />
      <div
        className={`w-[310px] sm:w-[480px]  min-h-[592px] rounded-[10px] pt-5 sm:pt-[70px] pl-[30px] sm:pl-[60px] pr-[20px] sm:pr-7 pb-12 mt-1 flex justify-center mb-5 $ bg-[#1d232c]`}
      >
        {jsxProp}
      </div>
    </div>
  );
};

export default AuthLayout;

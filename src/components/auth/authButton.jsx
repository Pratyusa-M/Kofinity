const AuthButton = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onClick, children, disabled, isMaxWidth, isMaxHeight,typeText } = props;

  return (
    <button
      className={`min-w-[115px] w-full ${isMaxWidth ? " max-w-[618px]" : "max-w-[360px]"} ${
        isMaxHeight ? "h-[40px] sm:h-[45px]" : "h-[42px]"
      } text-white text-base font-medium uppercase rounded-[50px] flex-col justify-center items-center inline-flex ${
        disabled
          ? "bg-zinc-500 cursor-not-allowed"
          : "bg-gradient-to-b from-[#9667F0] to-[#9B51E0] hover:from-purple-400 hover:to-violet-400"
      }`}
      type={typeText}
      onClick={onClick}
      disabled={disabled}
    >
      {children ? children : "Continue"}
    </button>
  );
};

export default AuthButton;

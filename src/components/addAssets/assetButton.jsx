const AssetButton = (props) => {
    // eslint-disable-next-line react/prop-types
    const { onClick, children, disabled,typeText } = props;
  
    return (
      <button
        className={`w-[113px] h-[36px] text-white text-base font-medium uppercase rounded-[50px] flex-col justify-center items-center inline-flex ${
          disabled
            ? "bg-[#A8A8A8] cursor-not-allowed"
            : "bg-gradient-to-b from-[#9667F0] to-[#9B51E0] hover:from-purple-400 hover:to-violet-400"
        }`}
        onClick={onClick}
        disabled={disabled}
        type={typeText}
      >
        {children ? children : "Continue"}
      </button>
    );
  };
  
  export default AssetButton;
  
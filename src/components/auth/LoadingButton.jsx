import { TailSpin } from "react-loader-spinner";

const LoadingButton = () => {
  // eslint-disable-next-line react/prop-types

  return (
    <button
      className="w-[100%] min-w-[115px] max-w-[360px] h-[42px] text-white text-base font-medium uppercase rounded-[50px] flex-col justify-center items-center inline-flex bg-zinc-500"
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

export default LoadingButton;

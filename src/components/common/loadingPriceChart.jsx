import { TailSpin } from "react-loader-spinner";

const LoadingStockPriceChart = () => {
  return (
    <div className="min-w-[265px] w-[100%] h-[538px] bg-[#191919] rounded-[2px] p-[24px] flex flex-col justify-center items-center gap-[5px]">
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
    </div>
  );
};

export default LoadingStockPriceChart;

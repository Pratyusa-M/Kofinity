/* eslint-disable react/prop-types */



const PrevButton = ({onClick,children}) =>{
    return(
        <button type="button" onClick={onClick} className="w-[160px] sm:w-[190px] h-[42px] bg-[#161B21] rounded-[24px] text-[15px] text-[#ffffff] text-opacity-70 text-roboto font-[500] tracking-[0.46px] border border-[#ffffff] border-opacity-70">{children}</button>
    )
}
export default PrevButton
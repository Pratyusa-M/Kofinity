/* eslint-disable react/prop-types */



const Checkbox = ({optionText,isSelected,onClick}) =>{
    return(
        <div onClick={onClick} className={`max-w-[370px] h-[56px] text-white  text-base font-medium text-roboto leading-normal tracking-[0.4px] border border-[#ffffff] border-opacity-25 hover:border-[#9768f0] rounded flex items-center pl-2 ${isSelected?'bg-[#9768f0]':'text-opacity-70'}`}>
            {optionText}
        </div>
    )
}

export default Checkbox
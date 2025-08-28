/* eslint-disable react/prop-types */



const RangeBar = ({width,pageNo,totalPages}) =>{
    // const wid  = '50'
    
    return(
        <div className="flex items-center gap-2 ">
           <div className="w-[150px] sm:w-[200px] h-[4px] bg-white">
             <div className={`w-${width} h-[100%] bg-[#6ccc94]`}></div>
           </div>
            <p className="text-[16px] text-roboto font-[400] text-[#6FCF97]">{pageNo}/{totalPages}</p>
        
        </div>

    )
}

export default RangeBar
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import plusicon from "../../assets/plusiconwhite.svg";


const getUserName = () =>{
  const name = localStorage.getItem('userName')
  if(name && name!== 'null' && name!==null && name!== undefined){
    return name
  }
  else{
    return 'user name'
  }
}

const Welcome = () => {

    const userName = getUserName()
  

  return (
    <>
      <div className="lg:w-[384px] lg:h-[384px] rounded-[190px] bg-[#191919] flex flex-col justify-center items-center p-10 text-center gap-5">
        <p className="text-[24px] text-white">Welcome!!</p>
        <p className="text-base text-white">
           {userName} get started with linking your first account.
        </p>
        <Link
          to="/addassets"
          className=" w-[224px] h-[36px] rounded-[18px] bg-[#9667F0] text-xs text-white font-medium text-roboto flex items-center justify-center lg:gap-5 gap-2"
        >
          <img src={plusicon} alt="" className="" />
          ADD ASSET
        </Link>
      </div>
    </>
  );
};

export default Welcome;

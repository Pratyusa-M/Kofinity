/* eslint-disable react/prop-types */
import { useState } from "react";
import UserEmail from "./userEmail";
import UserDetails from "./userDetails";
import UpdatePassword from "./updatePassword";
import cancelIcon from '../../assets/cancel.png'


const tabsData = [
    { id: 'email', tab: 'User Email', component: <UserEmail />},
    { id: 'password', tab: 'Update Password',component: <UpdatePassword/> },
    { id: 'details', tab: 'User Details',component: <UserDetails /> },
    // { id: 'details', label: 'User Details', component: <UserDetailsTab /> },

  ];

const ProfileSettings = () => {
 
  const [activeTab, setActiveTab] = useState(tabsData[0].id);

 

 
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  

  return (
    
       <div className="w-[100%] min-h-[100vh] bg-[#121212] flex flex-col gap-10">
        <div className="flex justify-between items-center mt-5">
            <div></div>
            <h1 className="text-[20px] font-[500] text-roboto text-[#ffffff]">Profile Setting</h1>
            <button type="button" onClick={close} className="flex items-center gap-1 mr-10 text-[#5D5D5D] text-[16px] font-[500] text-roboto"><img alt="cancel" src={cancelIcon}/><span>Close</span></button>
        </div>
        <div className="w-[70%] self-center flex items-center flex-wrap gap-10 border-b border-[#A8A8A8] mt-10">
        {tabsData.map((tab) => (
          <button key={tab.id} onClick={() => handleTabClick(tab.id)}  className={`text-[14px] font-[700] text-roboto pb-2 px-4 tracking-[0.5px] ${activeTab === tab.id ? 'text-[#ffffff] border-b-2 border-[#ffffff]' : 'text-[#A8A8A8]'}`}>
            {tab.tab}
          </button>
        ))}
      </div>
      <div className="w-[70%] self-center">
        {tabsData.map((tab) => (
          <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
            {tab.component}
          </div>
        ))}
      </div>
      

        </div>
    
  );
};

export default ProfileSettings;

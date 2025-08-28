/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import cancelIcon from "../../assets/cancel.png";
import UserEmail from "../../components/profileSettings/userEmail";
import UserDetails from "../../components/profileSettings/userDetails";
import UpdatePassword from "../../components/profileSettings/updatePassword";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const handleProfileSuccess = (message) => {
  toast.success(message, {});
};

const handleProfileFailure = (message) => {
  toast.error(message, {});
};

const tabsData = [
  {
    id: "email",
    tab: "User Email",
    component: (
      <UserEmail
        onProfileSuccess={handleProfileSuccess}
        onProfileFailure={handleProfileFailure}
      />
    ),
  },
  {
    id: "password",
    tab: "Update Password",
    component: (
      <UpdatePassword
        onProfileSuccess={handleProfileSuccess}
        onProfileFailure={handleProfileFailure}
      />
    ),
  },
  {
    id: "details",
    tab: "User Details",
    component: (
      <UserDetails
        onProfileSuccess={handleProfileSuccess}
        onProfileFailure={handleProfileFailure}
      />
    ),
  },
];

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const navigateToHome = () => {
    navigate("/allassets");
  };

  return (
    <>
      <ToastContainer />

      <div className="w-[100%] min-h-[100vh] bg-[#121212] flex flex-col gap-10">
        <div className="flex justify-between items-center mt-5">
          <div></div>
          <h1 className="text-[20px] font-[500] text-roboto text-[#ffffff]">
            Profile Settings
          </h1>
          <button
            type="button"
            onClick={navigateToHome}
            className="flex items-center gap-1 mr-10 text-[#5D5D5D] text-[16px] font-[500] text-roboto"
          >
            <img alt="cancel" src={cancelIcon} />
            <span>Close</span>
          </button>
        </div>
        <div className="w-[70%] self-center flex items-center flex-wrap gap-10 sm:border-b sm:border-[#A8A8A8] mt-10">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`text-[14px] text-roboto pb-2 px-4 tracking-[0.5px] ${
                activeTab === tab.id
                  ? "text-[#ffffff] font-[700]  border-b-2 border-[#ffffff]"
                  : "text-[#A8A8A8] font-[400] "
              }`}
            >
              {tab.tab}
            </button>
          ))}
        </div>
        <div className="w-[70%] self-center">
          {tabsData.map((tab) => (
            <div
              key={tab.id}
              style={{ display: activeTab === tab.id ? "block" : "none" }}
            >
              {tab.component}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;

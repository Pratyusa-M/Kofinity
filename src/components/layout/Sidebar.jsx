/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import portfolio from "../../assets/portfolio.svg";
import projections from "../../assets/projections.svg";
import transactions from "../../assets/transactions.svg";
import assetmanagement from "../../assets/assetmanagement.svg";
import userprofile from "../../assets/userprofile.svg";
import downarrow from "../../assets/downarrow.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubItem, selectSelectedSubItem } from '../../redux/store/slice/sidebarSlice'

const sidebarData = [
  {
    title: "Portfolio",
    imageSrc: portfolio,
    items: [
      { label: "All assets", url: "allassets" },
      { label: "Stocks", url: "stocks" },
      { label: "Real Estate", url: "realestate" },
      { label: "Crypto", url: "crypto" },
      { label: "Bank Account", url: "bankaccount" },
      { label: "Other Assets", url: "otherassets" },
    ],
    url: "",
  },
  // {
  //   title: "Asset Management",
  //   imageSrc: assetmanagement,
  //   items:[{label: 'Asset Management',url:'assetmanagement'}],
  //   url: "",
  // },
  {
    title: "Transactions",
    imageSrc: transactions,
    items: [
      { label: "Cash Flow", url: "cashflow" },
      { label: "P&L", url: "pl" },
      { label: "Debt", url: "debt" },
    ],
    url: "",
  },
  {
    title: "Analysis",
    imageSrc: projections,
    items: [
      { label: "Projection", url: "projection" },
      {label: "Analysis", url: "analysis"}
    ],
    url: "",
  },
  
];





const Sidebar = ({ layout }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [mSidebarOpen, setMSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileUrl = localStorage.getItem("profileUrl");
  const userName = localStorage.getItem("userName");
  const [userData, setUserData] = useState();
  const dispatch = useDispatch();
  const selectedLabel = useSelector(selectSelectedSubItem);
  const location = useLocation()
  const dropdownRef = useRef(null);
    const mobileSidebarRef = useRef(null);
    const profileRef = useRef(null);



  useEffect(() => {
    const handleGlobalClick = (event) => {
      // 1) Submenu‐dropdown: if click is outside dropdownRef, close it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveItem(null);
      }

      // 2) Mobile sidebar: if it's open and click is outside mobileSidebarRef, close it
      if (
        mSidebarOpen &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target)
      ) {
        setMSidebarOpen(false);
        setProfileOpen(false);
      }



      // 3) Profile popup: if open and click is outside profileRef, close it
       if (profileOpen && profileRef.current && !profileRef.current.contains(event.target) &&!mSidebarOpen) {
      
      setProfileOpen(false);
    }
  }

    document.addEventListener("mousedown", handleGlobalClick);
    return () => document.removeEventListener("mousedown", handleGlobalClick);
  }, [mSidebarOpen, profileOpen]);

const handleClickOutside = (event) => {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
   // setDropdownOpen(false);
   setActiveItem(null)
   
  //  setProfileOpen(false)
  }
};

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      profileUrl === "null" ||
      profileUrl === "" ||
      !profileUrl ||
      userName === "null" ||
      userName === "" ||
      !userName
    ) {
      getUserUserDetails();
    }
  }, []);

  useEffect(()=>{
    if (location.pathname==="/"){
      dispatch(setSelectedSubItem(""))
    }
   else if (location.pathname==="/allassets"){
      dispatch(setSelectedSubItem("All assets"))
    }
    else if (location.pathname==="/realestate"){
      dispatch(setSelectedSubItem("Real Estate"))
    }
    else if (location.pathname==="/crypto"){
      dispatch(setSelectedSubItem("Crypto"))
    }

    else if (location.pathname==="/bankaccount"){
      dispatch(setSelectedSubItem("Bank Account"))
    }
    else if (location.pathname==="/otherassets"){
      dispatch(setSelectedSubItem("Other Assets"))
    }
    else if (location.pathname==="/stocks"){
      dispatch(setSelectedSubItem("Stocks"))
    }
    else if (location.pathname==="/cashflow"){
      dispatch(setSelectedSubItem("Cash Flow"))
    }
    else if (location.pathname==="/pl"){
      dispatch(setSelectedSubItem("P&L"))
    }
    else if (location.pathname==="/debt"){
      dispatch(setSelectedSubItem("Debt"))
    }
    else if (location.pathname==="/projection"){
      dispatch(setSelectedSubItem("Projection"))
    }
    
  },[location.pathname, dispatch])

  // user details get api
  const getUserUserDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}users/profile/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("profileUrl", response?.data?.data?.profileUrl);
      localStorage.setItem("userName", response?.data?.data?.userName);
      setUserData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching on user data:", error);
    }
  };

  const subItemClick = (subLabel) =>{
    dispatch(setSelectedSubItem(subLabel));
  }


  const SideBarItems = () => {
    return (
      <>
        {sidebarData.map((item) => (
          <div
          //ref={dropdownRef}
            key={item.title}
            className={`relative group w-[42px] h-[42px] flex items-center justify-center rounded-lg z-50 ${
              activeItem === item.title
                ? "border border-[#985FEA]"
                : "border-none"
            }`}
          >
            <img
              src={item.imageSrc}
              alt={item.title}
              onClick={() => handleItemClick(item.title)}
              className={`w-[17px] h-[17px] cursor-pointer transition duration-300 transform ${
                activeItem === item.title ? "scale-110" : ""
              }`}
            />
            {activeItem === item.title && item.items && (
              <>
                <div className="w-0 h-0 absolute left-[55px] top-1 border-t-[5px] border-t-transparent border-r-[10px] border-r-[#323232] border-b-[5px] border-b-transparent"></div>
                <div className="absolute -top-0 left-16  rounded-md shadow-lg overflow-hidden w-[166px] bg-[#323232] text-white pb-2">
                  <div className="flex items-center gap-2 py-3 px-4 text-roboto text-sm justify-between border-b mb-4 border-b-[#BBBBBB33]">
                    {item?.title}{" "}
                    <button className="">
                      <img
                        src={downarrow}
                        alt=""
                        className=""
                        onClick={() => setActiveItem(null)}
                      />
                    </button>
                  </div>
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.label}
                      to={`${item.url}/${subItem.url}`}
                      className="block"
                    >
                      <div onClick={()=>subItemClick(subItem.label)} className={`py-2 px-4 hover:bg-[#9667F0] cursor-pointer flex items-center gap-3 text-roboto text-sm rounded-[4px] `}>
                        <img src={item.imageSrc} alt="" className="" />
                        {subItem.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </>
    );
  };

  const Profile = () => {
    return (
      <div className="flex items-center relative z-10" >
        <img
          src={profileUrl !== "null" ? profileUrl : userprofile}
          alt=""
          className="w-[28px] h-[28px] cursor-pointer rounded-[50%]"
          onClick={handleProfileOpen}
        />
        {profileOpen && (
          <>
            {" "}
            <div className="w-0 h-0 absolute left-[55px] top-1 border-t-[5px] border-t-transparent border-r-[10px] border-r-[#323232] border-b-[5px] border-b-transparent"></div>
            <div className="bg-[#2E2E2E] flex flex-col items-start absolute w-[202px] h-[141px] text-white top-0 left-16 rounded-[4px] px-3 py-3 gap-5"
             ref={profileRef}>
              <div className="flex items-center gap-3 w-full">
                <img
                  src={profileUrl !== "null" ? profileUrl : userprofile}
                  alt=""
                  className="w-[28px] h-[28px] rounded-[50%]"
                />
                <span className="text-sm font-medium text-roboto">
                  {userName!=='null' ? userName : "User name"}
                </span>
              </div>
              <Link to="/profilesettings" className="text-sm">
                Profile Settings
              </Link>
              <button className="text-[#FF4040] text-sm" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleItemClick = (title) => {
    setActiveItem(activeItem === title ? null : title);
    setProfileOpen(false);
  };

  const handleToggleMobileSidebar = (status) => {
    setMSidebarOpen(status);
  };

  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
    setActiveItem(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="flex relative bg-[#1D1D1D] min-h-screen" >
      {mSidebarOpen && (
        <div className="lg:none  fixed inset-0 min-h-screen z-50 bg-black bg-opacity-50 ">
          
          <div className="flex flex-col min-h-screen  items-center bg-[#1d1d1d] gap-10 w-[72px] pt-7"
          ref={mobileSidebarRef}>
            <button
              className="text-red-500 h-8 w-8 flex justify-center items-center"
              onClick={() => handleToggleMobileSidebar(false)}
            >
              <IoMdClose />
            </button>
            <Profile />
            <div className="flex flex-col items-center justify-start w-full gap-5"  ref={dropdownRef}>
              <SideBarItems />
            </div>
          </div>
        </div>
      )}

      <div className="lg:flex flex-col items-center gap-10 w-[72px] pt-[18px] hidden">
        <div  className="flex items-center justify-center">
        <Profile />
        </div>
        <div className="flex flex-col items-center w-full gap-5"  ref={dropdownRef}>
          <SideBarItems />
        </div>
      </div>

      <div className="w-full flex flex-col  justify-between">
        <div className="lg:hidden sticky bg-[#1d1d1d] top-0 px-3 py-2 flex items-center justify-between z-40">
          <button
            className="text-white h-8 w-8"
            onClick={() => handleToggleMobileSidebar(true)}
          >
            <RxHamburgerMenu className="h-5 w-5" />
          </button>
        </div>
        {layout}
      </div>
    </div>
  );
};

export default Sidebar;

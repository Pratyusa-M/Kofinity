/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import GoogleIcon from "../../assets/googleIcon.png";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../../utils/baseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";


const updateProfileDetails = async (name,email) => {
  const token = localStorage.getItem("token");
  const updatedUserDetails = {
    userName: name, 
  };
  try {
    const response = await axios.post(
      `${baseUrl}users/profile`,
      updatedUserDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);

  }
};

const firebaseConfig = {
  apiKey: "AIzaSyB5WIye6nfGX6Jsfcn_nXgSZBDDbtcOBYY",
  authDomain: "kofinity-dev.firebaseapp.com",
  projectId: "kofinity-dev",
  storageBucket: "kofinity-dev.appspot.com",
  messagingSenderId: "680911663276",
  appId: "1:680911663276:web:85607882429d13c1646f09",
  measurementId: "G-CSCXX50YJP",
};

const firebaseApp = initializeApp(firebaseConfig);

const GoogleButton = ({ onLoginSuccess, onLoginFailure }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const auth = getAuth(firebaseApp);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userEmail = user.email;
      const userDisplayName = user.displayName;
       localStorage.setItem('userName',userDisplayName)

      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}auth/signin/socialmedia`, {
          email: user?.email,
          signInType: "google",
        });
        localStorage.setItem("token", response?.data?.data?.access_token);
        // toast.success("Successfully Logged in", {});
        onLoginSuccess("Successfully Logged in")
        updateProfileDetails(user.displayName,user.email)
        setTimeout(() => {
          navigate("/allassets");
          deleteCurrentUser();
        }, 2000);
      } catch (error) {
        const errorMessage =
          typeof error?.response?.data?.message === "string"
            ? error?.response?.data?.message
            : "Login failed";
        // toast.error(errorMessage, {});
        onLoginFailure(errorMessage)
        console.error("Login failed:", error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading(false);
    }
  };

  const deleteCurrentUser = async () => {
    try {
      await auth.currentUser.delete();
      console.log("User handle successfully.");
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <div
        onClick={loading == false && signInWithGoogle}
        className={`w-[100%] max-w-[360px] h-[42px] bg-white rounded-[50px] shadow flex justify-center items-center gap-3 cursor-pointer`}
      >
        <img alt="google" src={GoogleIcon} className="w-[23px] h-[27px]" />
        {loading ? (
          <>
            {" "}
            <TailSpin
              height="20"
              width="20"
              color="gray"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </>
        ) : (
          <>
            <p className="text-black text-sm font-normal leading-[35px] tracking-wide text-roboto">
              Sign in with Google
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default GoogleButton;

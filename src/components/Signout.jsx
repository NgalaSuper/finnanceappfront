import React from "react";
import { useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { GoSignOut } from "react-icons/go";


const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear user data from local storage or state
    localStorage.removeItem("token"); // Adjust this if you use different keys
    // Optionally, clear user state if using Context or Redux
    // For example, if using Context: dispatch({ type: 'LOGOUT' });

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleSignOut} className="text-[18px]">
                <span className="text-[16px]">
                <GoSignOut className="text-[26px]" />

                </span>
              </button>
    </div>
  );
};

export default SignOut;

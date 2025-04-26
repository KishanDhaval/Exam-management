import { Settings } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileSettingBtn = () => {
    const navigate = useNavigate()
    const handleProfileClick = async()=>{
        navigate('/profile/settings')
    }
  return (
    <button onClick={handleProfileClick} className="flex items-center text-gray-600 hover:text-gray-900">
      <Settings className="w-5 h-5 mr-2" />
      <p className="hidden sm:block">Profile Settings</p>
    </button>
  );
};

export default ProfileSettingBtn;

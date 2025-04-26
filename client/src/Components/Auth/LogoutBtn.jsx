import { LogOut } from "lucide-react";
import React from "react";
import { useLogout } from "../../hooks/useLogout";

const LogoutBtn = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        className="flex items-center bg-red-100 px-2 py-2 sm:py-1 rounded text-red-900 hover:bg-red-200 transition"
      >
        <LogOut className="w-5 h-5 mr-1" />
        <p className="hidden md:block">logout</p>
      </button>
    </div>
  );
};

export default LogoutBtn;

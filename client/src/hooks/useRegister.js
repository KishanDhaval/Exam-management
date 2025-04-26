import { useAuthContext } from "./useAuthContext";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const register = async (name, email, password, role) => {
    try {
      const { data } = await axiosInstance.post(`/auth/register`, {
        name,
        email,
        password,
        role,
      });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "LOGIN", payload: data.user });
        if (data.user.role === "teacher") navigate("/dashboard/teacher");
        else navigate("/dashboard/student");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return { register };
};

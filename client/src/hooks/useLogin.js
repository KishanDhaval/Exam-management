import { useAuthContext } from "./useAuthContext";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post(`/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({ type: "LOGIN", payload: data.user });
        if (data.role === "teacher") navigate("/dashboard/teacher");
        else navigate("/dashboard/student");
      }
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  };

  return { login };
};

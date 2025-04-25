import { useSelector, useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from "../features/userSlice";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const isProduction = import.meta.env.VITE_NODE_ENV === "production";
  //console.log(isProduction, process.env.REACT_APP_NODE_ENV);
  const auth = useSelector((state) => state.auth);
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);

  const dispatch = useDispatch();

  const setAuth = (user, token) => {
    dispatch(loginSuccess({ user, token }));
  };

  const isAuthenticated = auth.user !== null;
  const isAdmin = auth.user?.isAdmin || false;

const signup = async (userName, email, password) => {
  dispatch(loginStart());
  try {
    await axiosInstance.post("/auth/signup", {
      username: userName,
      email,
      password,
    });
    dispatch(loginSuccess({ user: null, token: null }));
    toast.success(
      "🎉 Account created successfully! Check your email for verification instructions."
    );
    return true;
  } catch (err) {
    dispatch(loginFailure());
    const errorMessage =
      err.response?.data?.error || "An error occurred during signup.";
    toast.error(`❌ Signup failed: ${errorMessage}`);
    return errorMessage;
  }
};

const login = async (email, password) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("/auth/login", { email, password });

    setCookie("auth_token", res.data.token, {
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: isProduction,
    });

    dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    toast.success("🎉 Login successful! Welcome back!");
    return true;
  } catch (err) {
    dispatch(loginFailure());
    const errorMessage =
      err.response?.data?.error || "An error occurred during login.";
    toast.error(`❌ Login failed: ${errorMessage}`);
    return errorMessage;
  }
};

const refershToken = async () => {
  dispatch(loginStart());
  try {
    if (!cookies.auth_token) {
      dispatch(loginFailure());
      toast.error("⚠️ No authentication token found. Please log in again.");
      return;
    }

    const res = await axiosInstance.post(
      "/auth/token",
      {},
      {
        headers: {
          Authorization: `Bearer ${cookies.auth_token}`,
        },
      }
    );

    setCookie("auth_token", res.data.token, {
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: isProduction,
    });

    dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
    toast.success("🔄 Session refreshed successfully.");
  } catch (err) {
    console.log(err);
    dispatch(loginFailure());
    toast.error("❌ Failed to refresh session. Please log in again.");
  }
};

const logoutUser = () => {
  removeCookie("auth_token", { path: "/" });
  dispatch(logout());
  toast.success("👋 Logged out successfully. See you again!");
};


  return {
    auth,
    login,
    signup,
    refershToken,
    logoutUser,
    setAuth,
    isAuthenticated,
  };
};

export default useAuth;

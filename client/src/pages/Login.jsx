import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import userDetails from "../utils/UserDetails";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import Loading from "../components/Loading";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const validValues = Object.values(data).every((value) => value !== "");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userData = await userDetails();
        dispatch(setUserDetails(userData.data.data));

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white m-4 w-full max-w-lg mx-auto rounded p-7">
        <form onSubmit={handleSubmit} className="grid gap-2 py-4">
          <div className="grid">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoFocus
            />
          </div>
          <div className="grid">
            <label htmlFor="password">Password: </label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-whithin:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full outline-none"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <Link
              to="/forgot-password"
              className="block ml-auto text-primary-100 font-semibold hover:text-primary-200"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            disabled={!validValues}
            className={`${
              validValues
                ? "bg-green-800 hover:bg-green-600 cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            } text-white py-2 rounded font-semibold my-4 tracking-wide`}
          >
            Login
            {loading && (
              <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-slate-700 bg-opacity-80">
                <Loading />
              </div>
            )}
          </button>
        </form>
        <p>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary-100 font-semibold hover:text-primary-200"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;

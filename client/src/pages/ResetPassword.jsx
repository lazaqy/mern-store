import React, { useEffect, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validValues = Object.values(data).every((value) => value !== "");


  useEffect(() => {
    if (!(location.state?.data?.success)) {
      navigate("/");
    }
    if (location.state?.email) {
      setData({ ...data, email: location.state.email });
    }
  },[location]);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Password do not match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }

      if (response.data.error) {
        toast.error(response.data.message);
      }

    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white m-4 w-full max-w-lg mx-auto rounded p-7">
        <p>Enter your password</p>
        <form onSubmit={handleSubmit} className="grid gap-2 mt-6">
          <div className="grid">
            <label htmlFor="password">New Password: </label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-whithin:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                className="w-full outline-none"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter your new Password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          <div className="grid">
            <label htmlFor="confirmPassword">Confirm Password: </label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-whithin:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="w-full outline-none"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your Confirm Password"
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validValues}
            className={`${
              validValues ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-4 tracking-wide`}
          >
            Change Password
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-100 font-semibold hover:text-primary-200"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;

import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const validValues = Object.values(data).every((value) => value !== "");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
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
        <p>Welcome to Mern Store</p>
        <form onSubmit={handleSubmit} className="grid gap-2 mt-6">
          <div className="grid">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
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
            Register
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

export default Register;

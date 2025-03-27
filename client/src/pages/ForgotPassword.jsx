import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: ""
  });
    const navigate = useNavigate();
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const validValues = Object.values(data).every((value) => value !== "");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", { state: { email: data.email } });
        setData({
          email: ""
        });
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
        <p className="font-semibold text-lg mb-3">Reset Password</p>
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

          <button
            disabled={!validValues}
            className={`${
              validValues ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-4 tracking-wide`}
          >
            Send Otp
          </button>
        </form>
        <p>
          Alredy have an account?{" "}
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

export default ForgotPassword;

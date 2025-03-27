import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();
  
  useEffect(() => {
    if (!location.state?.email) {
      navigate("/forgot-password");
    }
  }, []);
  const validValues = data.every((value) => value !== "");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.verifyOtp,
        data: {
          otp: data.join(""),
          email: location.state?.email,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", { state: { email: location.state?.email, data: response.data } });
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
        <p className="font-semibold text-lg mb-3">Enter OTP</p>
        <form onSubmit={handleSubmit} className="grid gap-2 py-4">
          <div className="grid">
            <label htmlFor="otp">Enter Your OTP: </label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {data.map((value, index) => (
                <input
                  key={"otp" + index}
                  type="text"
                  id="otp"
                  ref={(el) => (inputRef.current[index] = el)}
                  value={data[index]}
                  onChange={(e) => {
                    setData(
                      data.map((value, i) =>
                        i === index ? e.target.value : value
                      )
                    );
                    if (e.target.value) {
                      inputRef.current[index + 1]?.focus();
                    }
                  }}
                  maxLength={1}
                  className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-primary-200 text-center font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            disabled={!validValues}
            className={`${
              validValues ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"
            } text-white py-2 rounded font-semibold my-4 tracking-wide`}
          >
            Verify Otp
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

export default OtpVerification;

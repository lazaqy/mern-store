import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setUserDetails } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import userDetails from "../utils/UserDetails";
import Loading from "../components/Loading";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setUserProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        const userData = await userDetails();
        dispatch(setUserDetails(userData.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-4">
      {/* profile avatar */}
      <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-full">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <FaRegUserCircle size={100} />
        )}
      </div>
      <button
        onClick={() => setUserProfileAvatarEdit(true)}
        className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3"
      >
        Edit
      </button>
      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setUserProfileAvatarEdit(false)} />
      )}
      {/* name, email, mobile */}
      <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid">
          <label
            className="block text-sm font-medium text-gray-700 select-none"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            onChange={handleOnchange}
            id="name"
            name="name"
            value={userData.name}
            className="p-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="grid">
          <label
            className="block text-sm font-medium text-gray-700 select-none"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="text"
            onChange={handleOnchange}
            id="email"
            name="email"
            value={userData.email}
            className="p-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="grid">
          <label
            className="block text-sm font-medium text-gray-700 select-none"
            htmlFor="mobile"
          >
            Mobile
          </label>
          <input
            type="text"
            onChange={handleOnchange}
            id="mobile"
            name="mobile"
            value={userData.mobile}
            className="p-1 block w-full rounded-md bg-blue-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <button className="border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded select-none">
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Profile;

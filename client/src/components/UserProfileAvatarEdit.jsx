import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { setUserDetails } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData,
      });

      if (response.data.success) {
        dispatch(
          setUserDetails({
            ...user,
            avatar: response.data.data.avatar,
          })
        );
        close()
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-50 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button
          onClick={close}
          className="text-neutral-500 w-fit block ml-auto"
        >
          <IoClose size={20} />
        </button>
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
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadProfileAvatar">
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="border border-primary-200 hover:bg-primary-200 px-4 py-1 rounded text-sm my-3 cursor-pointer select-none">
                  Upload
                </div>
              </>
            )}
            <input
              onChange={handleUploadAvatarImage}
              type="file"
              id="uploadProfileAvatar"
              className="hidden"
            />
          </label>
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;

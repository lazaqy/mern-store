import React from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { logout } from "../store/userSlice";
import { toast } from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ onClose }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await Axios(SummaryApi.logout);

      if (data.success) {
        dispatch(logout());
        localStorage.clear();

        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
          const name = cookie.split("=")[0].trim();
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        });
      
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      onClose?.();
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.email} {isAdmin(user.role) ? "(Admin)" : ""}
        </span>
        <Link onClick={onClose} to="/dashboard/profile">
          <HiOutlineExternalLink className="hover:text-primary-100" />
        </Link>
      </div>
      <Divider />
      <div className="text-sm grid gap-2">
        <Link
          onClick={onClose}
          to={"/dashboard/products"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Product
        </Link>
        {isAdmin(user.role) && (
          <>
            <Link
              onClick={onClose}
              to={"/dashboard/upload-product"}
              className="px-2 hover:bg-orange-200 py-1"
            >
              Upload Product
            </Link>
            <Link
              onClick={onClose}
              to={"/dashboard/category"}
              className="px-2 hover:bg-orange-200 py-1"
            >
              Category
            </Link>
            <Link
              onClick={onClose}
              to={"/dashboard/subcategory"}
              className="px-2 hover:bg-orange-200 py-1"
            >
              Sub Category
            </Link>
          </>
        )}
        <Link
          onClick={onClose}
          to={"/dashboard/my-orders"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          My Orders
        </Link>
        <Link
          onClick={onClose}
          to={"/dashboard/address"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Address
        </Link>
        <button onClick={handleLogout} className="text-left">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;

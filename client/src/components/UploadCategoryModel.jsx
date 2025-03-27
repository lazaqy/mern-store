import React, { useState } from "react";
import Axios from "../utils/Axios.js";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "./Loading.jsx";

const UploadCategoryModel = ({ close, fetchCategory }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleUploadCategory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const response = await uploadImage(file);
    const { data: imageResponse } = response;
    setLoading(false);
    setData({ ...data, image: imageResponse.data.url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 items-center flex justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="items-center flex justify-between">
          <h1 className="font-semibold">Category</h1>
          <button className="w-fit block ml-auto">
            <IoClose size={25} onClick={close} />
          </button>
        </div>
        <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter Category"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              className="bg-blue p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
              autoFocus
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500 select-none">
                    No Image
                  </p>
                )}
              </div>
              <label
                htmlFor="uploadCategoryImage"
                className="flex items-center"
              >
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <div
                      className={`${
                        !data.name
                          ? "bg-gray-400"
                          : "border-primary-200 hover:bg-primary-100"
                      } px-4 py-2 rounded select-none cursor-pointer border font-medium`}
                    >
                      Upload Image
                    </div>
                    <input
                      disabled={!data.name}
                      onChange={handleUploadCategory}
                      type="file"
                      name="uploadCategoryImage"
                      id="uploadCategoryImage"
                      className="hidden"
                    />
                  </>
                )}
              </label>
            </div>
          </div>
          <button
            type="submit"
            className={`${
              data.name && data.image
                ? "bg-primary-200 hover:bg-primary-100"
                : "bg-slate-200"
            }
              py-2 font-semibold rounded mt-6`}
          >
            Add Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;

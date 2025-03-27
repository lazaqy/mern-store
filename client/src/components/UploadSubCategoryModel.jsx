import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import uploadImage from "../utils/UploadImage";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

const UploadSubCategoryModel = ({ close, fetchSubCategory }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
    category: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const allCategories = useSelector((state) => state.product.allCategories);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: imageResponse } = response;
    setData((data) => ({ ...data, image: imageResponse.data.url }));
    setImageLoading(false);
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addSubCategory,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchSubCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-neutral-500 bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add Sub Category</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-3 grid gap-2" onSubmit={handleSubmitSubCategory}>
          
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="p-2 bg-blue-50 border outline-none focus-within:border-primary-200 rounded"
              autoFocus
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="category">Category</label>
            <div className="border p-3">
              <div className="flex flex-wrap gap-2">
                {data.category?.map((category, index) => {
                  return (
                    <div
                      key={category._id + "selectedValue"}
                      className="flex items-center gap-1 border border-primary-200 px-2 py-1 rounded text-primary-200 bg-white shadow-md"
                    >
                      {category.name}
                      <div
                        className="cursor-pointer hover:text-red-600"
                        onClick={() =>
                          setData((data) => ({
                            ...data,
                            category: data.category.filter(
                              (item) => item !== category
                            ),
                          }))
                        }
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <select
                onChange={(e) => {
                  const { value } = e.target;
                  if (value === "") return;
                  const categoryDetails = allCategories.find(
                    (category) => category._id === value
                  );
                  setData((data) => ({
                    ...data,
                    category: [...data.category, categoryDetails],
                  }));
                  setSelectedCategory("");
                }}
                name="category"
                id="category"
                className="w-full pt-4 bg-transparent rounded outline-none text-center"
                value={selectedCategory}
              >
                <option value={""}>-- Select Category --</option>
                {allCategories.map((category) => (
                  <option
                    key={category?._id + "_subCategory"}
                    value={category?._id}
                  >
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-1">
            <div>Image</div>
            <div className="flex flex-col lg:flex-row gap-3 items-center">
              <div className="border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center">
                {!data.image ? (
                  <div className="text-sm text-neutral-400">No Image</div>
                ) : (
                  <img
                    src={data.image}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              {imageLoading ? (
                <Loading />
              ) : (
                <>
                  <label htmlFor="uploadSubCategoryImage">
                    <div className="px-4 py-2 border border-primary-200 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer select-none">
                      Upload
                    </div>
                    <input
                      type="file"
                      id="uploadSubCategoryImage"
                      name="image"
                      onChange={handleUploadSubCategoryImage}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className={`${
                  data?.name && data?.image && data?.category?.length > 0
                    ? "bg-primary-200 text-white hover:bg-primary-100 hover:text-white hover:scale-110 flex items-center justify-center gap-2 my-8 cursor-pointer"
                    : "bg-slate-200 items-center justify-center gap-2 cursor-not-allowed my-8"
                }
                py-2 font-semibold rounded mt-6 px-4`}
              >
                Add Sub Category
              </button>
            </div>
          )}

        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;

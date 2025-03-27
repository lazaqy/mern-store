import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import AddMoreField from "../components/AddMoreField";
import ViewImage from "../components/ViewImage";
import uploadImage from "../utils/UploadImage";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import successAlert from "../utils/succesAlert";

const UploadProduct = () => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const allCategories = useSelector((state) => state.product.allCategories);
  const allSubCategories = useSelector((state) => state.product.allSubCategories);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddMoreField, setOpenAddMoreField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: [],
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleUploadProductImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: imageResponse } = response;
    setData((data) => ({
      ...data,
      image: [...data.image, imageResponse.data.url],
    }));
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    setData((data) => ({
      ...data,
      image: data.image.filter((item, i) => i !== index),
    }));
  };

  const handleDeleteCategory = async (index) => {
    data.category.splice(index, 1);
    setData((data) => ({ ...data }));
  };

  const handleDeleteSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((data) => ({ ...data }));
  };

  const handleAddMoreField = () => {
    setData((data) => ({
      ...data,
      more_details: { ...data.more_details, [fieldName]: "" },
    }));
    setFieldName("");
    setOpenAddMoreField(false);
  };

  const handleDeleteMoreField = (value) => {
    delete data.more_details[value];
    setData((data) => ({ ...data }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addProduct,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(response.data.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: [],
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="">
      <div className="px-6 py-4 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <form className="grid p-4 gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="font-medium">Image</div>
          <label
            htmlFor="productImage"
            className="bg-blue-50 h-24 flex items-center justify-center p-2 rounded-md outline-none border focus-within:border-primary-200 cursor-pointer"
          >
            {imageLoading ? (
              <Loading />
            ) : (
              <>
                <div className="flex text-center items-center justify-center flex-col select-none">
                  <FaCloudUploadAlt size={30} />
                  <div>Upload Image</div>
                </div>
                <input
                  type="file"
                  id="productImage"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleUploadProductImage(e)}
                />
              </>
            )}
          </label>
          {data.image.map((image, index) => (
            <Fragment key={image + "-" + index}>
              <div className="inline-block mr-2 h-20 w-20 shadow-md border relative mt-2">
                <img
                  src={image}
                  alt="full image"
                  className="w-full h-full object-scale-down cursor-pointer hover:scale-110"
                  onClick={() => setViewImage(image)}
                />
                <div
                  onClick={() => handleDeleteImage(index)}
                  className="absolute bottom-0 right-0 rounded-full bg-blue-50 text-red-400 hover:scale-110 hover:text-red-600 p-1 cursor-pointer"
                >
                  <MdDelete size={20} />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Product Name"
              className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200"
              required
              value={data.name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="Enter Product Name"
              className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200 resize-none"
              required
              value={data.description}
              rows={2}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="category" className="font-medium">
              Category
            </label>
            <div className="">
              <div className="flex flex-wrap gap-4 mb-2">
                {data.category?.length > 0 &&
                  data.category?.map((category, index) => (
                    <div
                      key={index}
                      className="text-sm flex items-center gap-1 bg-blue-500 text-white px-2 rounded mt-1"
                    >
                      <div>{category.name}</div>
                      <div
                        onClick={() => handleDeleteCategory(index)}
                        className="hover:text-white hover:bg-red-800 rounded-full p-1 cursor-pointer"
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  ))}
              </div>
              <select
                name="category"
                id="category"
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const category = allCategories.find(
                    (category) => category._id === e.target.value
                  );
                  setData((data) => ({
                    ...data,
                    category: [...data.category, category],
                  }));
                  setSelectCategory("");
                }}
              >
                <option value="">-- Select Category --</option>
                {allCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="subCategory" className="font-medium">
              Sub Category
            </label>
            <div>
              <div className="flex flex-wrap gap-3 mb-2">
                {data.subCategory?.length > 0 &&
                  data.subCategory?.map((subCategory, index) => (
                    <div
                      key={index}
                      className="text-sm flex items-center gap-1 bg-blue-500 text-white px-2 rounded mt-1"
                    >
                      <div>{subCategory.name}</div>
                      <div
                        onClick={() => handleDeleteSubCategory(index)}
                        className="hover:text-white hover:bg-red-800 rounded-full p-1 cursor-pointer"
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  ))}
              </div>
              <select
                name="subCategory"
                id="subCategory"
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const subCategory = allSubCategories.find(
                    (subCategory) => subCategory._id === e.target.value
                  );
                  setData((data) => ({
                    ...data,
                    subCategory: [...data.subCategory, subCategory],
                  }));
                  setSelectSubCategory("");
                }}
              >
                <option value="">-- Select Sub-Category --</option>
                {allSubCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              id="unit"
              placeholder="Enter Product Unit"
              className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200"
              required
              value={data.unit}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="stock" className="font-medium">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              placeholder="Enter Product Stock"
              className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200"
              required
              value={data.stock}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="price" className="font-medium">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              placeholder="Enter Product Price"
              className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200"
              required
              value={data.price}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="discount" className="font-medium">
              Discount
            </label>
            <input
              type="number"
              name="discount"
              id="discount"
              placeholder="Enter Product Discount"
              className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200"
              required
              value={data.discount}
              onChange={(e) => handleChange(e)}
            />
          </div>
          {Object?.keys(data?.more_details)?.map((value, index) => {
            return (
              <div className="grid gap-1" key={index}>
                <label htmlFor={value} className="font-medium flex flex-wrap">
                  {value}
                  <button
                    onClick={() => handleDeleteMoreField(value)}
                    className="bg-blue-50 border rounded-full hover:scale-110 hover:bg-red-50 hover:text-red-600 px-2 ml-2 cursor-pointer"
                  >
                    <IoClose size={20} />
                  </button>
                </label>
                <input
                  type="text"
                  name={value}
                  id={value}
                  className="bg-blue-50 p-2 rounded-md outline-none border focus-within:border-primary-200"
                  required
                  value={data?.more_details[value]}
                  onChange={(e) => {
                    setData((data) => ({
                      ...data,
                      more_details: {
                        ...data.more_details,
                        [value]: e.target.value,
                      },
                    }));
                  }}
                />
              </div>
            );
          })}
        </div>
        <div
          onClick={() => setOpenAddMoreField(true)}
          className="bg-white hover:bg-primary-200 py-1 px-2 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-800 cursor-pointer rounded mt-4 select-none"
        >
          Add Fields
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Loading />
          ) : (
            <button className="bg-white hover:bg-primary-300 py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-white hover:bg-primary-200 cursor-pointer rounded mt-3">
              Submit
            </button>
          )}
        </div>
      </form>

      {viewImage && (
        <ViewImage url={viewImage} close={() => setViewImage(null)} />
      )}

      {openAddMoreField && (
        <AddMoreField
          close={() => {
            setOpenAddMoreField(false);
          }}
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={() => handleAddMoreField()}
        />
      )}
    </section>
  );
};

export default UploadProduct;

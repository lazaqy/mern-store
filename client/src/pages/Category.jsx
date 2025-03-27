import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategory from "../components/EditCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [category, setCategory] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });

  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    image: "",
  });

  const fetchCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setCategory(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const allCategories = useSelector((state) => state.product.allCategories);

  useEffect(() => {
    setCategory(allCategories);
  },[]);
  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        setConfirmDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section>
      <div className="flex p-2 font-semibold bg-white shadow-md items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-primary-200 hover:bg-primary-100 px-3 py-1 rounded select-none"
        >
          Add Category
        </button>
      </div>
      {!category[0] && <NoData />}

      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {category.map((cat, index) => {
          return (
            <div key={index} className="w-32 h-56 rounded shadow-md">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full object-scale-down"
              />
              <div className="items-center h-9 flex gap-2">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(cat);
                  }}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(true);
                    setDeleteCategory(cat);
                  }}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1 rounde"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {openUploadCategory && (
        <UploadCategoryModel
          close={() => setOpenUploadCategory(false)}
          fetchCategory={fetchCategory}
        />
      )}

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => {
            setOpenEdit(false);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmBox
          close={() => {
            setConfirmDelete(false);
          }}
          cancel={() => {
            setConfirmDelete(false);
          }}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default Category;

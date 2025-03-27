import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import NoData from "../components/NoData";
import ViewImage from "../components/ViewImage";
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";
import { useSelector } from "react-redux";
import ConfirmBox from "../components/ConfirmBox";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const SubCategory = () => {
  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false);
  const [subCategory, setSubCategory] = useState({});
  const columnHelpers = createColumnHelper();
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSubCategory, setDeleteSubCategory] = useState({});

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setSubCategory(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const subCategoryColumns = [
    columnHelpers.accessor("name", {
      header: "Name",
    }),
    columnHelpers.accessor("image", {
      header: "Image",
      cell: ({ getValue }) => (
        <div className="flex justify-center items-center">
          <img
            src={getValue()}
            className="w-8 h-8 cursor-pointer hover:scale-110"
            onClick={() => setImageURL(getValue())}
          />
        </div>
      ),
    }),
    columnHelpers.accessor("category", {
      header: "Category",
      cell: ({ getValue }) => (
        <>
          <div className="flex justify-center items-center">
            <p className="shadow-md px-1 inline-block">
              {getValue()
                .map((item) => item.name)
                .join(", ")}
            </p>
          </div>
        </>
      ),
    }),
    columnHelpers.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-green-100 rounded-full hover:text-green-600 text-green-500"
            >
              <HiPencil size={20} />
            </button>
            <button
              onClick={() => {
                setDeleteSubCategory(row.original);
                setConfirmDelete(true);
              }}
              className="p-2 bg-red-100 rounded-full hover:text-red-600 text-red-500"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setConfirmDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section>
      <div className="flex p-2 font-semibold bg-white shadow-md items-center justify-between">
        <h2 className="font-semibold">Sub Category</h2>
        <button
          onClick={() => {
            setOpenUploadSubCategory(true);
          }}
          className="text-sm border border-primary-200 hover:bg-primary-100 px-3 py-1 rounded select-none"
        >
          Add Sub Category
        </button>
      </div>
      {!subCategory[0] ? (
        <NoData />
      ) : (
        <div>
          <DisplayTable
            className="overflow-auto w-full max-w-[95vw]"
            data={subCategory}
            columns={subCategoryColumns}
          />
        </div>
      )}
      {openUploadSubCategory && (
        <UploadSubCategoryModel
          close={() => {
            setOpenUploadSubCategory(false);
          }}
          fetchSubCategory={() => {
            fetchSubCategory();
          }}
        />
      )}
      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}
      {openEdit && (
        <EditSubCategory
          close={() => {
            setOpenEdit(false);
          }}
          data={editData}
        />
      )}
      {confirmDelete && (
        <ConfirmBox
          cancel={() => {
            setConfirmDelete(false);
          }}
          confirm={() => {
            handleDeleteSubCategory(deleteSubCategory);
          }}
          close={() => {
            setConfirmDelete(false);
          }}
        />
      )}
    </section>
  );
};

export default SubCategory;

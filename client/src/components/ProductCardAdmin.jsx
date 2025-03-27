import React, { useState } from "react";
import EditProduct from "../components/EditProduct";
import ConfirmBox from "../components/ConfirmBox";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteProduct = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        setDeleteOpen(false);
        fetchProductData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="w-36 p-4 border border-slate-200 shadow-md rounded-md">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <div className="text-ellipsis line-clamp-2 font-small text-xs">
        {data?.name}
      </div>
      <div className="text-slate-400">{data?.unit}</div>
      <div className="grid grid-cols-2 gap-3 py-2">
        <button
          onClick={() => setEditOpen(true)}
          className="border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="border px-1 py-1 text-sm border-red-600 bg-red-200 text-red-600 hover:bg-red-200 rounded"
        >
          Delete
        </button>
      </div>
      {editOpen && (
        <EditProduct
          close={() => setEditOpen(false)}
          data={data}
          fetchProductData={fetchProductData}
        />
      )}
      {deleteOpen && (
        <ConfirmBox
          cancel={() => setDeleteOpen(false)}
          confirm={() => deleteProduct()}
          close={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCardAdmin;

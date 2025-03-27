import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useGlobalContext } from "../providers/GlobalProvider";

const AddToCartButton = ({ data }) => {
  const { fetchCartItems, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailable, setIsAvailable] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetail, setCartItemDetail] = useState();
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id
        }
      })
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItems) {
          fetchCartItems();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const item = cartItem.some((item) => item.productId._id === data?._id);
    setIsAvailable(item);
    const product = cartItem.find(item => item.productId._id === data?._id);
    setQty(product?.quantity || 0);
    setCartItemDetail(product);

  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await updateCartItem(cartItemDetail?._id, qty + 1);

    if (response.success) {
      toast.success("Item Added");
    }
  }

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (qty === 1) {
      deleteCartItem(cartItemDetail?._id);
    } else {
      const response = await updateCartItem(cartItemDetail?._id, qty - 1);

      if (response.success) {
        toast.success("Item Removed");
      }
    }
  }

  return (
    <div className="w-full max-w-[150px]">
      {
        isAvailable ? (
          <div className="flex">
            <button onClick={decreaseQty} className="bg-green-600 hover:bg-green-500 text-white p-1 flex flex-1 items-center justify-center rounded">
              <FaMinus />
            </button>
            <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">{qty}</p>
            <button onClick={increaseQty} className="bg-green-600 hover:bg-green-500 text-white p-1 flex flex-1 items-center justify-center rounded">
              <FaPlus />
            </button>
          </div>
        ) : (
            <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded">{loading ? <Loading /> : "Add"}</button>
        )
      }
    </div>
  )
}

export default AddToCartButton
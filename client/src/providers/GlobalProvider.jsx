import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartProduct";
import { priceAfterDiscount } from "../utils/PriceAfterDiscount";
import toast from "react-hot-toast";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [discountTotalPrice, setDiscountTotalPrice] = useState(0);
  const user = useSelector((state) => state.user);
  const cartItem = useSelector((state) => state.cartItem.cart);

  const fetchCartItems = async () => {
    try {
      const response = await Axios(SummaryApi.getCartItem);
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(addToCart(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItem,
        data: {
          _id: id,
          qty: qty,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        // toast.success(responseData.message);
        fetchCartItems();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      // AxiosToastError(error)
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    const qty = cartItem.reduce((acc, item) => {
      return acc + item?.quantity;
    }, 0);
    setTotalQty(qty);

    const price = cartItem.reduce((acc, item) => {
      const priceDiscount = priceAfterDiscount(
        item?.productId?.price,
        item?.productId?.discount
      );
      return acc + priceDiscount * item.quantity;
    }, 0);
    setTotalPrice(price);

    const totalPrice = cartItem.reduce((acc, item) => {
      return acc + item?.productId?.price * item?.quantity;
    }, 0);
    setDiscountTotalPrice(totalPrice);
  }, [cartItem]);

  const handleLogoutOut = () => {
    localStorage.clear();
    dispatch(addToCart([]));
  };

  useEffect(() => {
    fetchCartItems();
    handleLogoutOut();
    fetchAddress();
    fetchOrder();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        discountTotalPrice,
        fetchOrder,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

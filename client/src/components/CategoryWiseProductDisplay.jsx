import React, { useEffect, useRef, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useNavigate } from "react-router-dom";
import CardLoading from "./CardLoading";
import AxiosToastError from "../utils/AxiosToastError";
import CardProduct from "./CardProduct";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import UrlConverter from "../utils/UrlConverter";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const loadingCardNumber = new Array(6).fill(0);
  const allSubCategories = useSelector((state) => state.product.allSubCategories);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id: id },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const scrollRight = () => {
    containerRef.current.scrollLeft += containerRef.current.offsetWidth;
  };

  const scrollLeft = () => {
    containerRef.current.scrollLeft -= containerRef.current.offsetWidth;
  };

  const redirectProductList = () => {
    const subCategories = allSubCategories.find((subCategory) => {
      return subCategory.category.some((category) => category._id === id);
    });
    const url = `/${UrlConverter(name)}-${id}/${UrlConverter(
      subCategories?.name
    )}-${subCategories?._id}`;
    navigate(url);
  };

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <div onClick={redirectProductList} className="text-green-600 hover:text-green-400 cursor-pointer">
          See All
        </div>
      </div>

      <div
        className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
        ref={containerRef}
      >
        {loading &&
          loadingCardNumber.map((item, index) => {
            return <CardLoading key={index} />;
          })}

        {data.map((item, index) => {
          return (
            <CardProduct item={item} key={item._id + "CategoryWiseProduct"} />
          );
        })}

        {
          <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex items-center justify-between">
            <button
              onClick={scrollLeft}
              className="z-10 relative bg-white shadow-lg p-2 hover:bg-gray-100 text-lg rounded-full"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={scrollRight}
              className="z-10 relative bg-white shadow-lg p-2 hover:text-gray-500 text-lg rounded-full"
            >
              <FaAngleRight />
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;

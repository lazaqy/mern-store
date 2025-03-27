import React, { Fragment, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useParams } from "react-router-dom";
import CardProduct from "../components/CardProduct";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import UrlConverter from "../utils/UrlConverter";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [subCategories, setSubCategories] = useState([]);

  const params = useParams();
  const allSubCategories = useSelector(
    (state) => state.product.allSubCategories
  );

  const subCategory = params.subCategory.split("-");
  const subcategoryName = subCategory
    .slice(0, subCategory.length - 1)
    .join("-");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSub,
        data: {
          page: page,
          limit: 12,
          category: categoryId,
          subCategory: subCategoryId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (page === 1) {
          setData(responseData.data);
        } else {
          setData((prevData) => [...prevData, ...responseData.data]);
        }
        setTotalPageCount(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);

  useEffect(() => {
    const filteredSubCategories = allSubCategories.filter(({ category }) =>
      category.some(({ _id }) => _id === categoryId)
    );
    setSubCategories(filteredSubCategories);
  }, [params, allSubCategories]);

  return (
    <section className="stycky top-24 lg:top-20">
      <div className="container mx-auto grid grid-cols-[100px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[300px,1fr]">
        {/* sub-category */}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll  grid gap-1 shadow-md scrollbarCustom bg-white py-2">
          {subCategories.map((sub, index) => {
            const link = `/${UrlConverter(sub?.category[0]?.name)}-${
              sub?.category[0]?._id
            }/${UrlConverter(sub.name)}-${sub._id}`;
            return (
              <Link
                key={index}
                to={link}
                className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                  hover:bg-green-100 cursor-pointer
                  ${subCategoryId === sub._id ? "bg-green-100" : ""}
                `}
              >
                <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border cursor-pointer">
                  <img
                    src={sub.image}
                    alt="sub-category"
                    className="w-14 lg:h-14 lg:w-12 object-scale-down"
                  />
                </div>
                <div className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base font-semibold">
                  {sub.name}
                </div>
              </Link>
            );
          })}
        </div>

        {/* product */}
        <div className="min-h-[70vh]">
          <div className="bg-white shadow-md p-2">
            <h3 className="font-semibold">{subcategoryName}</h3>
          </div>
          <div>{loading && <Loading />}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {data.map((product, index) => {
              return <CardProduct key={index} item={product} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;

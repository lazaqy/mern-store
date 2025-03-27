import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setProductData(responseData.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let flag = true;
    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    }
  }, [page, search]);

  const handleNext = () => {
    if (page === totalPageCount) return;
    setPage(page + 1);
    fetchProductData();
  }

  const handlePrevious = () => {
    if (page === 1) return;
    setPage(page - 1);
    fetchProductData();
  }

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  }

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="flex items-center bg-blue-50 min-w-24 px-2 py-1 rounded border focus-within:border-primary-200">
          <IoSearchOutline size={25} />
          <input
            onChange={handleOnChange}
            type="text"
            placeholder="Search Product"
            className="bg-blue-50 outline-none ml-2"
          />
        </div>
      </div>
      {loading && <Loading />}

      <div className="p-4">
        <div className="min-h-[50vh]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {productData.map((product, index) => {
              return (
                <ProductCardAdmin
                  key={index}
                  data={product}
                  fetchProductData={fetchProductData}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
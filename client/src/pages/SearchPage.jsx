import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import InfiniteScroll from "react-infinite-scroll-component";
import CardProduct from "../components/CardProduct";
import { useLocation } from "react-router-dom";
import imageNoData from "../assets/nothing here yet.webp";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(0);
  const [page, setPage] = useState(1);
  const [tatalPage, setTotalPage] = useState(1);
  const params = useLocation();
  const searchText = params?.search?.slice(3);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      } else {
        setData((data) => [...data, ...responseData.data]);
      }

      setTotalPage(responseData.pageCount);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <div className="font-semibold">Search: {data.length}</div>
        <InfiniteScroll
          dataLength={data.length}
          next={() => setPage(page + 1)}
          hasMore={page < tatalPage}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <CardProduct
                key={item?._id + "searchProduct" + index}
                item={item}
              />
            ))}
            {loading &&
              loadingArrayCard.map((item, index) => (
                <CardLoading key={item + "CardLoading" + index} />
              ))}
          </div>
        </InfiniteScroll>

        {!data[0] && !loading && (
          <>
            <div className="flex flex-col items-center justify-center w-full mx-auto">
            <img src={imageNoData} alt="No Data" className="w-full h-full max-w-xs max-h-xs block" />
            <div className="font-semibold my-2">No Data Found</div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;

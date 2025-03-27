import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import DisplayPrice from "../utils/DisplayPrice";
import { priceAfterDiscount } from "../utils/PriceAfterDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplay = () => {
  const params = useParams();
  
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(0);
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const productId = params.product?.split("-").slice(-1)[0];
  const imageContainer = useRef();

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          id: productId,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
        setImage(responseData.data.image[0]);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2">
      <div className="">
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
          <img
            src={image}
            alt="image"
            className="w-full h-full object-scale-down"
          />
        </div>
        <div className="flex items-center justify-center gap-3 my-2">
          {data.image.map((img, index) => {
            return (
              <div
                key={img + index + "point"}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                  index === image && "bg-slate-300"
                }`}
              ></div>
            );
          })}
        </div>
        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
          >
            {data.image.map((item, index) => (
              <div
                className="w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md"
                key={index}
              >
                <img
                  src={item}
                  alt="min-image"
                  className="w-full h-full object-scale-down"
                  onClick={() => setImage(item)}
                />
              </div>
            ))}
          </div>
          <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
            <button
              onClick={handleScrollLeft}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div className="my-4 hidden lg:grid gap-3 ">
          <div>
            <div className="font-semibold">Description</div>
            <div className="text-base">{data.description}</div>
          </div>
          <div>
            <div className="font-semibold">Unit</div>
            <div className="text-base">{data.unit}</div>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={index}>
                  <div className="font-semibold">{element}</div>
                  <div className="text-base">{data?.more_details[element]}</div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <div className="bg-green-300 w-fit px-3 py-1 rounded-full text-xs">
          10 Min
        </div>
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <div className="px-2 my-2">{data.unit}</div>
        <Divider />
        <div>
          <div className="">Price</div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <div className="font-semibold text-lg lg:text-xl">
                {DisplayPrice(priceAfterDiscount(data.price, data.discount))}
              </div>
            </div>
            {data.discount > 0 && (
              <div className="line-through italic">
                {DisplayPrice(data.price)}
              </div>
            )}
            {data.discount > 0 && (
              <div className="text-green-600 font-bold lg:text-2xl">
                {data.discount}%
                <span className="text-base text-neutral-500 ml-1">
                  Discount
                </span>
              </div>
            )}
          </div>
        </div>

        {data.stock === 0 ? (
          <p className="text-lg text-red-500 my-2">Out of Stock</p>
        ) : (
          // <button className="my-4 px-4 py-1 bg-green-600 text-white hover:bg-green-700 rounded-md">
          //   Add to Cart
          // </button>
          <div className="my-4">
            <AddToCartButton data={data} />
          </div>
        )}

        <h2 className="font-semibold text-lg">Why Shop from Mern-Store</h2>
        <div>
          <div className="flex items-center gap-3">
            <img src={image1} alt="image-delivery" className="w-20 h-20" />
            <div className="text-sm">
              <div>Superfast Delivery</div>
              <p>Get your order delivered in 10 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src={image2} alt="Best-offer" className="w-20 h-20" />
            <div className="text-sm">
              <div>Best Offer</div>
              <p>
                Best pricr destination with offers directly from the
                manufacturers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src={image3} alt="wide-assortment" className="w-20 h-20" />
            <div className="text-sm">
              <div>Wide Assortment</div>
              <p>Choose from 5000+ product acroos 100+ categories</p>
            </div>
          </div>
        </div>

        {/* Mobile Only */}

        <div className="my-4 grid gap-3 lg:hidden">
          <div>
            <div className="font-semibold">Description</div>
            <div className="text-base">{data.description}</div>
          </div>
          <div>
            <div className="font-semibold">Unit</div>
            <div className="text-base">{data.unit}</div>
          </div>
          {data?.more_details &&
            Object.keys(data?.more_details).map((element, index) => {
              return (
                <div key={index}>
                  <div className="font-semibold">{element}</div>
                  <div className="text-base">{data?.more_details[element]}</div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;

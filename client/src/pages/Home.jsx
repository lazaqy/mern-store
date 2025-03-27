import React, { useEffect, useState } from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import UrlConverter from "../utils/UrlConverter";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const Home = () => {
  const loadingCategories = useSelector(
    (state) => state.product.loadingCategories
  );
  const allCategories = useSelector((state) => state.product.allCategories);
  const allSubCategories = useSelector(
    (state) => state.product.allSubCategories
  );
  const navigate = useNavigate();

  const redirectProductList = (id, name) => {
    const subCategories = allSubCategories.find((subCategory) => {
      return subCategory.category.some((category) => category._id === id);
    });
    const url = `/${UrlConverter(name)}-${id}/${UrlConverter(subCategories.name)}-${subCategories._id}`;
    navigate(url);
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div
          className={`w-full h-full min-h-48 bg-blue-100 rounded ${
            !banner && "animate-pulse my-2"
          }`}
        >
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block"
          />
          <img
            src={bannerMobile}
            alt="banner"
            className="w-full h-full lg:hidden"
          />
        </div>
      </div>

      <div className="container mx-auto p-4 my-2 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {loadingCategories
          ? new Array(6).fill(0).map((_, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-blue-100 min-h-24 rounded">
                    <div className="bg-blue-100 h-8 rounded"></div>
                  </div>
                </div>
              );
            })
          : allCategories.map((category, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow"
                >
                  <div
                    onClick={() =>
                      redirectProductList(category._id, category.name)
                    }
                    className="bg-blue-100 min-h-24 rounded cursor-pointer"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {allCategories.map((category, index) => {
        return (
          category._id && <CategoryWiseProductDisplay
            key={category._id + "CategoryWiseProductDisplay"}
            id={category._id}
            name={category.name}
          />
        );
      })}
    </section>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { TiShoppingCart } from "react-icons/ti";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import DisplayPrice from "../utils/DisplayPrice";
import { useGlobalContext } from "../providers/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCart, setOpenCart] = useState(false);

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => setIsUserMenuOpen(false);

  const handleMobileUserMenu = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };

  return (
    <header className="bg-blue-50 h-28 lg:h-20 shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1">
      {!(isMobile && isSearchPage) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/* logo */}
          <div className="h-full">
            <Link to="/" className="h-full flex justify-center items-center">
              <img
                src={logo}
                alt="logo"
                width={140}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="logo"
                width={140}
                height={60}
                className="lg:hidden"
              />
            </Link>
          </div>
          {/* search */}
          <div>
            <div className="hidden lg:block">
              <Search />
            </div>
          </div>
          {/* login & cart */}
          <div className="">
            {/* mobile */}
            <button
              onClick={handleMobileUserMenu}
              className="text-neutral-600 lg:hidden"
            >
              <FaRegUserCircle size={26} />
            </button>

            {/* desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {isUserMenuOpen ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-17">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu onClose={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLogin} className="text-lg px-2">
                  {/* <FaRegUserCircle size={26} /> */}
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCart(true)}
                className="flex items-center gap-2 bg-green-700 py-2 px-4 rounded-lg text-white"
              >
                {/* cart */}
                <div className="animate-bounce">
                  <TiShoppingCart size={26} />
                </div>
                <div className="font-semibold">
                  {cartItem[0] ? <p>{totalQty} items</p> : <p>My Cart</p>}
                  <p>{DisplayPrice(totalPrice)}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {openCart && <DisplayCartItem close={() => setOpenCart(false)} />}
    </header>
  );
};

export default Header;

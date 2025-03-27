import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import userDetails from "./utils/UserDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import { setAllCategories, setAllSubCategories, setLoadingCategories } from "./store/productSlice";
import SummaryApi from "./common/SummaryApi";
import Axios from "./utils/Axios";
import AxiosToastError from "./utils/AxiosToastError";
import GlobalProvider from "./providers/GlobalProvider";
import CartMobileLink from "./components/CartMobile";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const fetchUser = async () => {
    const userData = await userDetails();
    dispatch(setUserDetails(userData?.data?.data));
  };
  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategories(true))
      const response = await Axios({
        ...SummaryApi.getCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategories(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategories(false));
    }
  };
  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllSubCategories(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobileLink />}
    </GlobalProvider>
  );
}

export default App;

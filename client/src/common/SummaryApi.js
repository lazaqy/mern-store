export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
  register: {
    url: "api/users/register",
    method: "POST",
  },
  login: {
    url: "api/users/login",
    method: "POST",
  },
  forgotPassword: {
    url: "api/users/forgot-password",
    method: "PUT",
  },
  verifyOtp: {
    url: "api/users/verify-password-otp",
    method: "PUT",
  },
  resetPassword: {
    url: "api/users/reset-password",
    method: "PUT",
  },
  refreshToken: {
    url: "api/users/refresh-token",
    method: "POST",
  },
  getUserDetails: {
    url: "api/users/user-details",
    method: "GET",
  },
  logout: {
    url: "api/users/logout",
    method: "POST",
  },
  uploadAvatar: {
    url: "api/users/upload-avatar",
    method: "PUT",
  },
  updateUserDetails: {
    url: "api/users/update-user",
    method: "PUT",
  },
  uploadImage: {
    url: "api/files/upload",
    method: "POST",
  },
  addCategory: {
    url: "api/category/add",
    method: "POST",
  },
  getCategory: {
    url: "api/category/get",
    method: "GET",
  },
  updateCategory: {
    url: "api/category/update",
    method: "PUT",
  },
  deleteCategory: {
    url: "api/category/delete",
    method: "DELETE",
  },
  addSubCategory: {
    url: "api/sub-category/add",
    method: "POST",
  },
  getSubCategory: {
    url: "api/sub-category/get",
    method: "GET",
  },
  updateSubCategory: {
    url: "api/sub-category/update",
    method: "PUT",
  },
  deleteSubCategory: {
    url: "api/sub-category/delete",
    method: "DELETE",
  },
  addProduct: {
    url: "api/product/add",
    method: "POST",
  },
  getProduct: {
    url: "api/product/get",
    method: "POST",
  },
  updateProduct: {
    url: "api/product/update",
    method: "PUT",
  },
  deleteProduct: {
    url: "api/product/delete",
    method: "DELETE",
  },
  getProductByCategory: {
    url: "api/product/get-product-by-category",
    method: "POST",
  },
  getProductByCategoryAndSub: {
    url: "api/product/get-product-by-category-and-subcategory",
    method: "POST",
  },
  getProductDetails: {
    url: "api/product/get-product-details",
    method: "POST",
  },
  searchProduct: {
    url: "api/product/search",
    method: "POST",
  },
  addToCart: {
    url: "api/cart/add",
    method: "POST",
  },
  getCartItem: {
    url: "api/cart/get",
    method: "GET",
  },
  updateCartItem: {
    url: "api/cart/update-qty",
    method: "PUT",
  },
  deleteCartItem: {
    url: "api/cart/delete-cart-item",
    method: "DELETE",
  },
  createAddress: {
    url: "api/address/create",
    method: "POST",
  },
  getAddress: {
    url: "/api/address/get",
    method: "get",
  },
  updateAddress: {
    url: "/api/address/update",
    method: "put",
  },
  disableAddress: {
    url: "/api/address/disable",
    method: "delete",
  },
  CashOnDeliveryOrder: {
    url: "/api/order/cash-on-delivery",
    method: "post",
  },
  payment_url: {
    url: "/api/order/checkout",
    method: "post",
  },
  getOrderItems: {
    url: "/api/order/order-list",
    method: "get",
  },
};

export default SummaryApi;

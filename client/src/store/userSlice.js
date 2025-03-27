import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
  mobile: "",
  veriry_email: "",
  last_login_date: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  wishlist: [],
  orderHistory: [],
  role: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    logout: (state) => {
      state = { ...initialState };
      return state;
    },
  },
});

export const { setUserDetails, logout } = userSlice.actions;
export default userSlice.reducer;

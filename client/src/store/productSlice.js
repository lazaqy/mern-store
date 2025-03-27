import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allCategories: [],
  loadingCategories: false,
  allSubCategories : [],
  allProducts : [],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setAllCategories: (state, action) => { state.allCategories = [...action.payload] },
    setLoadingCategories: (state, action) => { state.loadingCategories = action.payload},
    setAllSubCategories : (state, action) => {state.allSubCategories = [...action.payload]},
    setAllProducts : (state, action) => {state.allProducts = [...action.payload]},
  }
})

export const {
  setAllCategories,
  setLoadingCategories,
  setAllSubCategories,
  setAllProducts,
} = productSlice.actions;

export default productSlice.reducer
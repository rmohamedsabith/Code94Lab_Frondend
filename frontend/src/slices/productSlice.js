import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:"product",
    initialState:{
        isLoading:false,
        isReviewSubmitted:false,
        isProductAdded:false,
        isProductDeleted:false,
        isProductUpdated:false,
    },
    reducers:{
       
       
        clearProduct(state,action){
            return{
                ...state,
                isLoading:false,
                product:{},
                isProductDeleted:false,
                isProductUpdated:false,
                isProductAdded:false
                }
        },

        //One product
        productRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        productSuccess(state,action){
            return{
                isLoading:false,
                product:action.payload.product,
            }
        },
        productFail(state,action){
            return {
                isLoading:false,
                error:action.payload
            }
        },

        //Update product
        updateProductRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        updateProductSuccess(state,action){
            return{
                ...state,
                isLoading:false,
                isProductUpdated:true,
                product:action.payload.Product,
            }
        },
        updateProductFail(state,action){
            return {
                isLoading:false,
                error:action.payload
            }
        },
        
        //Add product
        addProductRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        addProductSuccess(state,action){
            return{
                ...state,
                isLoading:false,
                isProductAdded:true,
                product:action.payload.Product,
            }
        },
        addProductFail(state,action){
            return {
                isLoading:false,
                error:action.payload
            }
        },
        
        //Delete product
        deleteProductRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        deleteProductSuccess(state,action){
            return{
                ...state,
                isLoading:false,
                isProductDeleted:true,
            }
        },
        deleteProductFail(state,action){
            return {
                isLoading:false,
                error:action.payload
            }
        },
         clearError(state, action){
            return {
                ...state,
                error:  null,
                isProductAdded:false,
                isProductDeleted:false,
                isProductUpdated:false,
            }
        },


    }
});

const {actions,reducer}=productSlice;

export const{
    clearError,
    clearProducts,
    productRequest,
    productSuccess,
    productFail,
    clearProduct,
    addProductRequest,
    addProductSuccess,
    addProductFail,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
}=actions

export default reducer
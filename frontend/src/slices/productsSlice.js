import { createSlice } from "@reduxjs/toolkit";

const productsSlice=createSlice({
    name:"products",
    initialState:{
        isLoading:false
    },
    reducers:{
        productsRequest(state,action){
            return {
                ...state,
                isLoading:true}
        },
        productsSuccess(state,action){
            return{
                ...state,
                isLoading:false,
                products:action.payload.Products,
                totalCount:action.payload.Total_count,
                resPerPage:action.payload.resPerPage,
                count:action.payload.count,
            }
        },
        productsFail(state,action){
            return {
                ...state,
                isLoading:false,
                error:action.payload
            }
        },
        clearError(state, action){
            return {
                ...state,
                error:  null
            }
        },
        clearProducts(state,action){
            return{
                ...state,
                isLoading:false,
                products:null,
                totalCount:null,
                resPerPage:null}
        },
       

    }
});

const {actions,reducer}=productsSlice;

export const{
    productsRequest,
    productsSuccess,
    productsFail,
    clearError,
    clearProducts,
}=actions

export default reducer
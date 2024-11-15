import axios from 'axios'
import { addProductFail, addProductRequest, addProductSuccess,deleteProductFail,deleteProductRequest,deleteProductSuccess,productFail, productRequest, productSuccess, updateProductFail, updateProductRequest, updateProductSuccess } from '../slices/productSlice'
import { removeFavorite } from './favoritesAction'

export const getProduct=(id)=>async(dispatch)=>{
    try {
        dispatch(productRequest())
        const {data}=await axios.get(`/Vendor/product/${id}`)
        dispatch(productSuccess(data))
    } catch (error) {
        dispatch(productFail(error.response.data.message))
    }
}

export const addProduct=productData=>async(dispatch)=>{
    try {
        dispatch(addProductRequest())
        const {data}=await axios.post(`/Vendor/product/new`,productData)
        dispatch(addProductSuccess(data))   
        console.log(data)     
    } catch (error) {
        dispatch(addProductFail(error.response.data.message))

    }
}
export const updateProduct=(id,formData)=>async(dispatch)=>{
    try {
        dispatch(updateProductRequest())
        const {data}=await axios.put(`/Vendor/product/${id}/edit`,formData)
        dispatch(updateProductSuccess(data))        
    } catch (error) {
        dispatch(updateProductFail(error.response.data.message))

    }
}
export const deleteProduct=id=>async(dispatch)=>{
    try {
        dispatch(deleteProductRequest())
        const {data}=await axios.delete(`/Vendor/product/${id}/delete`)
        dispatch(deleteProductSuccess(data))  
        dispatch(removeFavorite(id));      
    } catch (error) {
        dispatch(deleteProductFail(error.response.data.message))

    }
}









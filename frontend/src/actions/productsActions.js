
import {clearError, productsFail, productsRequest, productsSuccess } from "../slices/productsSlice"
import axios from 'axios'

export const getProducts=(keyword,currentPage)=>async(dispatch)=>{
    
    try {
        dispatch(productsRequest())
        let link=`/Vendor/products?page=${currentPage}`

        if(keyword)link+=`&keyword=${keyword}`;
        const {data} = await axios.get(link)
        dispatch(productsSuccess(data))
        
    } catch (error) {
        dispatch(productsFail(error.response.data.message))
    }

}

export const clearProductsError=(dispatch)=>{
    dispatch(clearError())
}






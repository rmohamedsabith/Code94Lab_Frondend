import axios from 'axios'
import {favoritesFail, favoritesRequest, favoritesSuccess, addFavoritesFail, addFavoritesRequest, addFavoritesSuccess, removeFavoritesRequest, removeFavoritesSuccess, removeFavoritesFail } from '../slices/favoritesSlice'

export const getFavorites = () => async (dispatch) => {
    try {
        dispatch(favoritesRequest());
        const localFavorites = localStorage.getItem('favorites');
        
        if (localFavorites) {
            const favoritesData = {
                sucess:true,
                favorites:{
                    favoriteProductIds:JSON.parse(localFavorites)
                }
            };
            dispatch(favoritesSuccess(favoritesData));
        } else {
            const { data } = await axios.get(`/Vendor/favorites`);
            console.log(data)
            localStorage.setItem('favorites', JSON.stringify(data.favorites.favoriteProductIds));
            // Dispatch the success action with the fetched data
            dispatch(favoritesSuccess(data));
        }
    } catch (error) {
        dispatch(favoritesFail(error.response.data.message));
    }
};



export const addFavorite=(id)=>async(dispatch)=>{
    try {
        dispatch(addFavoritesRequest())
        const {data}=await axios.put(`/Vendor/favorites/add`,{id})
       // Ensure data and data.favorites exist
       if (data && data.favorites) {
        dispatch(addFavoritesSuccess(data));
        localStorage.setItem('favorites', JSON.stringify(data.favorites.favoriteProductIds));
    } else {
        throw new Error("Unexpected response structure");
    }   
    } catch (error) {
        dispatch(addFavoritesFail(error.response.data.message))

    }
}
export const removeFavorite = (id) => async (dispatch) => {
    try {
        dispatch(removeFavoritesRequest());
        const { data } = await axios.put(`/Vendor/favorites/remove`, { id });
        
        // Ensure data and data.favorites exist
        if (data && data.favorites) {
            dispatch(removeFavoritesSuccess(data));
            localStorage.setItem('favorites', JSON.stringify(data.favorites.favoriteProductIds));
        } else {
            throw new Error("Unexpected response structure");
        }
    } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
        dispatch(removeFavoritesFail(errorMessage));
    }
};










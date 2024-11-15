import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice=createSlice({
    name:"favorites",
    initialState:{
        isLoading:false,
        favorites:[]
    },
    reducers:{      
        clearFavorites(state,action){
            return{
                ...state,
                isLoading:false,
               
                favorites:[]
                }
        },

        //getFavorites
        favoritesRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        favoritesSuccess(state,action){
            return{
                isLoading:false,
                favorites:action.payload.favorites,
            }
        },
        favoritesFail(state,action){
            return {
                isLoading:false,
                error:action.payload
            }
        },

        //add favorites
        addFavoritesRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        addFavoritesSuccess(state,action){
            return{
                ...state,
                isLoading:false,
                isfavoritesadded:true,
            }
        },
        addFavoritesFail(state,action){
            return {
                isLoading:false,
                error:action.payload
            }
        },
        
        //remove favorites
        removeFavoritesRequest(state,action)
        {
            return{
                ...state,
                isLoading:true
            }
        },
        removeFavoritesSuccess(state,action){
            return{
                ...state,
                isLoading:false,
                isfavoritesremoveed:true,
            }
        },
        removeFavoritesFail(state,action){
            return {
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
        // updateFavoritesLocal(state, action) {
        //     state.favorites.favoriteProductIds = action.payload;
        //   }
          


    }
});

const {actions,reducer}=favoriteSlice;

export const{
    clearError,
    clearFavoritess,
    favoritesRequest,
    favoritesSuccess,
    favoritesFail,
    clearFavorites,
    removeFavoritesRequest,
    removeFavoritesSuccess,
    removeFavoritesFail,
    addFavoritesRequest,
    addFavoritesSuccess,
    addFavoritesFail,
    // updateFavoritesLocal
}=actions

export default reducer

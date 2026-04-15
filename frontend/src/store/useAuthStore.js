import {create} from "zustand";

export const useAuthStore = create((set)=>({
    authUser : {name : "Ak" , _id : 123 , age : 25},
    isLoading : false,
    isLoggedIn : false,

    login : () =>{
        console.log("We just Logged In");
        set({isLoggedIn : true,isLoading : true});
    }
}));
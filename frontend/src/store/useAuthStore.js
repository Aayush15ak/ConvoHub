import {create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser : null,
    isCheckingAuth : true,

    checkAuth : async() => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser : res.data.user});
        }
        catch (error) {
            console.error('Error checking authentication:', error);
            set({authUser : null});
        }
        finally{
            set({isCheckingAuth : false});
        }
    }
}))

import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
    },

    signup : async (data) => {
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({authUser : res.data});
            toast.success("Signup successful! Welcome to ConvoHub.");
        }
        catch (error) {
            console.error('Error signing up:', error);
            toast.error(error.response.data.message || "Signup failed. Please try again.");
        }
        finally {
            set({isSigningUp : false});
        }
    }
}))

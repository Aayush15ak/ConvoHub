import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser : null,
    isCheckingAuth : true,
    isSigningUp: false,
    isUpdatingProfilePic: false,

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
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({authUser : res.data});
            toast.success("Signup successful! Welcome to ConvoHub.");
        }
        catch (error) {
            console.error('Error signing up:', error);
            const message =
            error.response?.data?.message ||  // backend error
            error.message ||                  // network error
            "Login failed";

            toast.error(message);

        }
        finally {
            set({isSigningUp : false});
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        }
        catch (error) {
            toast.error(error.response.data.message || "Login failed. Please check your credentials and try again.");
        }
        finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        }
        catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", error);
        }
    },
    //TO-DO ... while the profile pic is getting updating i want a loader on the avatar icon ... as now while the pic is updating in the backend the frontend already shows the pic before its even updated in the backend
    updateProfile : async(data) => {
        set({isUpdatingProfilePic : true});
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        }
        catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile picture. Please try again.");
        }
        finally{
            set({isUpdatingProfilePic : false});
        }
    }
}))

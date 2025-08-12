//zustand
//use to store diffrent states and functions 
// used to manage user authentication
// it works with useState and useEffect hooks to manage state


import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

//the below code works like a global state to manage user authentication in a React application and all its components can access and modify this state 
//bwlow code creates a state that includes authUser, isSigningUp, isLoggingIn, isUpdatingProfile, and isCheckingAuth for user authentication
export const useAuthStore = create((set) => ({
    authUser : null,
    isSigningUp : false,
    isLoggingIng : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,  //to use or create va loding animation during authentication process
    checkAuth : async () => { //to check if user is authenticated
        try {
            const res = await axiosInstance.get("/auth/check");  // we defined the check auth api in the backend
            set({authUser:res.data}); //update the state with the authenticated user
        } catch (error) {
            set({authUser: null}); //if authentication fails, set the authUser to null
            console.error(error);
        }
        finally{
            set({isCheckingAuth: false}); //set the isCheckingAuth to false before the request is finished
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        console.log(res.data);
        toast.success("Profile updated successfully");
        } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response.data.message);
        } finally {
        set({ isUpdatingProfile: false });
        }
    },


}));




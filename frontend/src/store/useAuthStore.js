import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import {toast} from 'react-hot-toast';
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5007": "/";
export const useAuthStore = create((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
            get().connectSocket();
        }catch(err){
            console.log("Error in checking",err);
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async(data) =>{
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        }catch(err){
            toast.error(err.response.data);
        } finally{
            set({isSigningUp: false});
        }
    },

    logout: async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(err){
            console.log("error in logout",err)
            toast.error(err);
        }
    },

    login: async(data)=>{
        set({isLoggingIn: true})
        try{
            const res =  await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("Login successfully")
            get().connectSocket();
        }catch(err){
            console.log("Error in logging in",err);
            toast.error(err.response.data);
        }finally{
            set({isLoggingIn: false})
        }
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile: true})
        try{
            const res = await axiosInstance.post("/auth/update-profile",data,{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            set({authUser: res.data});
            toast.success("Updated successfully");

        }catch(err){
            console.log("error in update profile",err);
            toast.error(err.response.data.message)
        }finally{
            set({isUpdatingProfile: false});
        }
    },
    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query: {
                userId: authUser._id,
            },
        })
        socket.connect();
        set({socket: socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers: userIds})
        });
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}))
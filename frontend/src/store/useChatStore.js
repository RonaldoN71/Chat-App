import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from './useAuthStore.js';
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  groupMessages: [],
  selectedGroup: null,
  groups: [],
  isGroupsLoading: false,
  isGroupMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId)=>{
    set({ isMessagesLoading: true});
    try{
      const res = await axiosInstance.get(`/message/${userId}`);
      set({messages: res.data})
    }catch(err){
      toast.error(err.response.data.message);
    }finally{
      set({isMessagesLoading: false});
    }
  },
  sendMessage: async(messageData) =>{
    const {selectedUser,messages} = get();
    try{
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
      set({ messages: [...messages, res.data] });
    }catch(err){
      console.log("error in sending",err);
      toast.error(err.response.data.message);
    }
  },
  subscribeToMessages: () =>{
    const {selectedUser} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if(!isMessageSentFromSelectedUser) return;

      set({
        messages:[...get().messages,newMessage],
      })
    })
  },

  unsubscribeFromMessages: ()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  createGroup: async (groupData) => {
  try {
    const res = await axiosInstance.post("/message/group/create", groupData);
    set((state) => ({
      groups: [...state.groups, res.data],
    }));
    toast.success("Group created successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create group");
  }
},

getGroups: async () => {
  set({ isGroupsLoading: true });
  try {
    const res = await axiosInstance.get("/message/group/get");
    set({ groups: res.data });
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch groups");
  } finally {
    set({ isGroupsLoading: false });
  }
},
  getGroupMessages: async(groupId)=>{
    set({isGroupMessagesLoading: true});
    try{
      const res = await axiosInstance.get(`/message/Gget/${groupId}`);;
      set({groupMessages: res.data});
    }catch (err) {
  toast.error(err.response?.data?.message || "Failed to fetch group messages");
} finally {
  set({ isGroupMessagesLoading: false });
}
  },

  sendGroupMessages: async(messageData)=>{
    const {groupMessages,selectedGroup} = get();
    const { authUser } = useAuthStore.getState();

    try{
      const res = await axiosInstance.post(`/message/Gsend/${selectedGroup._id}`,messageData);
      const messageWithSender = {
    ...res.data,
    senderId: { _id: authUser._id, profilePic: authUser.profilePic },
  };

      set({ groupMessages: [...groupMessages, messageWithSender] });
    }catch(err){
      console.log("error in sending ",err);
      toast.error(err.response?.data?.message)
    }
  },
  setSelectedUser: (user) =>
  set({
    selectedUser: user,
    selectedGroup: null, // clear group when selecting user
  }),

setSelectedGroup: (group) =>{
  set({
    selectedGroup: group ? { ...group } : null,
    selectedUser: null,
    groupMessages: [],
  });
}
}));
import React from 'react'
import ChatHeader from './ChatHeader';
import {useEffect,useRef} from 'react';
import {useChatStore} from '../store/useChatStore.js';
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from './MessageInput.jsx';
import { formatMessageTime } from "../lib/utils";
import MessageSkeleton from "./skeletons/MessageSkeleton";

function ChatContainer() {
  const messageEndRef = useRef(null);
  const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages,isGroupMessagesLoading,selectedGroup,groupMessages,getGroupMessages} = useChatStore();
  const {authUser} = useAuthStore();

 useEffect(() => {
  if (selectedUser) {
    console.log("selected User",selectedUser)
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }
}, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

useEffect(() => {
  if (selectedGroup) {
    console.log("selected group",selectedGroup)
    getGroupMessages(selectedGroup._id);
  }
}, [selectedGroup, getGroupMessages]);


  useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, groupMessages]);

   if (isMessagesLoading || isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {selectedUser && !selectedGroup && (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message)=>(
          <div 
          key={message._id}
          className={`chat ${message.senderId=== authUser._id ? "chat-end": "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                src={
                  message.senderId === authUser._id ?
                  authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img 
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
             </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div> )}

       {selectedGroup && !selectedUser && (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessages.map((message)=>(
          <div 
          key={message._id}
          className={`chat ${message.senderId._id=== authUser._id ? "chat-end": "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                src={
                  message.senderId === authUser._id ?
                  authUser.profilePic || "/avatar.png" : message.senderId.profilePic || "/avatar.png"
                }
                alt="profile pic"
                />
              </div>
            </div>

                <div className="chat-header mb-1 flex items-center gap-1">
                         <span className="text-sm font-semibold">
                     {message.senderId?._id === authUser._id ? "You" : message.senderId?.fullName || "Unknown"}
                        </span>
                    <time className="text-xs opacity-50">
                           {formatMessageTime(message.createdAt)}
                   </time>
                      </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img 
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
             </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div> )}

     <MessageInput/>
      
    </div> 
  )
}

export default ChatContainer

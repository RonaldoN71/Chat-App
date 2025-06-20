import React from 'react'
import { X } from "lucide-react";
import {useChatStore} from '../store/useChatStore.js'
import {useAuthStore} from '../store/useAuthStore.js'
function ChatHeader() {
    const {selectedUser,setSelectedUser,selectedGroup,setSelectedGroup} = useChatStore();
    const {onlineUsers} = useAuthStore();
  return (
   <>
    {selectedUser && !selectedGroup && (

        <div className="p-2.5 border-b border-base-300" >
     <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="avatar">
                <div className="size-10 rounded-full relative">
                    <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName}/>
                </div>
                </div>

                {/* use info */}
                <div>
                    <h3 className="font-medium">{selectedUser.fullName}</h3>
                    <p className="text-sm text-base-content/70">{onlineUsers.includes(selectedUser._id) ? "Online": "Offline"}</p>
                </div>    
        </div>

            {/* close  button */}
            <button onClick={()=> setSelectedUser(null)}><X/></button>
        </div>
     </div>
    )}

    {!selectedUser && selectedGroup && (

        <div className="p-2.5 border-b border-base-300" >
     <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="avatar">
                <div className="size-10 rounded-full relative">
                    <img src={"/avatar.png"} alt={selectedGroup.name}/>
                </div>
                </div>

                {/* use info */}
                <div>
                    <h3 className="font-medium">{selectedGroup.name}</h3>
                   <span className="text-sm text-gray-600">
  ({selectedGroup?.members?.length || 0} members)
</span>
                </div>    
        </div>

            {/* close  button */}
            <button onClick={()=> setSelectedGroup(null)}><X/></button>
        </div>
     </div>
    )}
   
   </>
   
    
  )
}

export default ChatHeader

import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

function Sidebar() {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading,selectedGroup,setSelectedGroup ,createGroup,groups,getGroups} = useChatStore();
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
   useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers,getGroups]);

  const filteredUsers = showOnlineOnly ? users.filter((user)=>onlineUsers.includes(user._id)): users;

   const handleUserSelection = (e, userId) => {
  setSelectedUsers((prev) =>
    e.target.checked ? [...prev, userId] : prev.filter((id) => id !== userId)
  );
};

const handleCreate = () => {
  if (groupName && selectedUsers.length) {
    createGroup({ name: groupName, members: selectedUsers });
    setShowCreateGroup(false);
    setGroupName("");
    setSelectedUsers([]);
  }
};


  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-72  flex flex-col  transition-all duration-200">
        <div className="border-b border-base-400 w-full p-5">
                <div className="flex items-center gap-2">
             <Users className="size-6" />
              <span className="font-medium hidden lg:block">Contacts</span>
              </div>
              {/* online filter toggle */}
              <div>
                <label  className="cursor-pointer flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked = {showOnlineOnly}
                    onChange={(e)=> setShowOnlineOnly(e.target.checked)}
                    className="checkbox checkbox-sm"
                    />
                    <span className="text-sm">Show online only</span>
                </label>
                <span className="text-xs text-zinc-500">({onlineUsers.length>0 ?onlineUsers.length-1:0} online)</span>
              </div>
           </div>
        <div className="overflow-y-auto w-full py-3 ">
            {filteredUsers.map((user)=>(
                <button
                key={user._id} onClick={()=>setSelectedUser(user)}
                className= {`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors 
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
                >
                    <div className="relative mx-0">
                    <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"/>
                    )}
                    </div>

                    {/* User info - only visible on larger screens */}
            <div className=" lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
                </button>
            ))}

            {filteredUsers.length ===0 && (
                <div className="text-center text-zinc-500 py-4">No online Users</div>
            )}
        </div>
        <div className="border-t border-base-400 w-full p-1 mt-3">
            <button 
               onClick={() => setShowCreateGroup(true)} 
              className="w-full   text-white rounded-lg"
              >
              + Create Group
          </button>
          <h3 className="font-medium">Groups</h3>
  {groups.map((group) => (
  <button
    key={group._id}
    onClick={() => setSelectedGroup(group)} 
    className={`
      w-full p-3 flex items-center gap-3 rounded-lg 
      hover:bg-base-300 transition-colors 
      ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
    `}
  >
    <div className="font-semibold truncate">{group.name}</div>
    <span className="text-sm text-gray-600">({group.members.length} members)</span>
  </button>
))}
 </div>

         {showCreateGroup && (
  <div className="p-4 bg-gray-100 rounded-lg mt-2">
    <input 
      type="text" 
      placeholder="Group Name" 
      className="input input-sm w-full"
      onChange={(e) => setGroupName(e.target.value)}
    />
    <div className="mt-2">
      {users.map((user) => (
        <label key={user._id} className="flex items-center gap-2">
          <input 
            type="checkbox" 
            value={user._id} 
            onChange={(e) => handleUserSelection(e, user._id)}
          />
          {user.fullName}
        </label>
      ))}
    </div>
    <button 
      onClick={handleCreate} 
      className="mt-2 p-2 bg-green-500 text-white rounded-lg"
    >
      Create Group
    </button>
  </div>
)}
    </aside>
  )
}

export default Sidebar

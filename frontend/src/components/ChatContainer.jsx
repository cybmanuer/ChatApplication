
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx"; 
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";


const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null); // useRef for scroll to bottom


  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages]);


  useEffect(() => { // scroll to bottom when new message arrives
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // below code is to display the msg skeleton while the messages are loading
  if (isMessagesLoading) {
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}  //dasi ui for chat box icon based on sender or reciver"
            ref={messageEndRef}> 
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={  //add logic to get profile pic from the db or use a default image for the sender and receiver
                    message.senderId === authUser._id
                      ? authUser.profilePic || "../src/assets/avatar.png"
                      : selectedUser.profilePic || "../src/assets/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {/* //add logic to format the time string based on the user's timezone or use a default format for the sender and receiver"
                // it is defined in util.js */}
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
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
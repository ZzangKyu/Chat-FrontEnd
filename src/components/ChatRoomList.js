import React from "react";

const ChatRoomList = ({ chatRooms, onSelectRoom }) => {
  return (
    <div>
      {chatRooms.map((room) => (
        <div
          key={room.chatRoomId}
          className="p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => onSelectRoom(room.chatRoomId)}
        >
          <span>{room.title}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;

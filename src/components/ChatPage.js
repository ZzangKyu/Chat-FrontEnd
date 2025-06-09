import React, { useState, useEffect } from "react";
import ChatRoomList from "./ChatRoomList";
import MemberList from "./MemberList";
import ChatRoom from "./ChatRoom";
import { getChatRooms } from "../apis/ChatRoomApi";
import { getMembers } from "../apis/MemberApi";

const ChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isMemberList, setIsMemberList] = useState(false); // 사용자 목록 or 채팅방 목록 토글

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    const response = await getChatRooms();
    if (response.status === "OK") {

      console.log("response.data : " + JSON.stringify(response.data));
      setChatRooms(response.data);
    } else {
      console.error("채팅방 목록 불러오기 실패");
    }
  };

  const handleMemberListClick = () => {
    setIsMemberList(true);
    fetchMembers();
  };

  const fetchMembers = async () => {
    const response = await getMembers();
    if (response.status === "OK") {
      setMembers(response.data);
    } else {
      console.error("사용자 목록 불러오기 실패");
    }
  };

  const handleChatRoomListClick = () => {
    setIsMemberList(false);
    fetchChatRooms(); // 채팅방 목록 불러오기
  };

  // 선택된 채팅방의 소켓 연결
  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* 좌측 패널 (사용자 목록 or 채팅방 목록) */}
      <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
        {/* 상단 버튼 */}
        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 p-2 ${isMemberList ? "bg-gray-700" : "bg-gray-900"}`}
            onClick={handleMemberListClick}
          >
            사용자 목록
          </button>
          <button
            className={`w-1/2 p-2 ${!isMemberList ? "bg-gray-700" : "bg-gray-900"}`}
            onClick={handleChatRoomListClick}
          >
            채팅방 목록
          </button>
        </div>

        {/* 사용자 목록 or 채팅방 목록 */}
        {isMemberList ? (
          <MemberList members={members} />
        ) : (
          <ChatRoomList chatRooms={chatRooms} onSelectRoom={handleSelectRoom} />
        )}
      </div>

      {/* 선택된 채팅방 화면 */}
      <div className="w-3/4 p-4">
        {selectedRoomId ? (
          <ChatRoom roomId={selectedRoomId}/>
        ) : (
          <div className="flex justify-center items-center h-full">
            <span>채팅방을 선택하세요.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

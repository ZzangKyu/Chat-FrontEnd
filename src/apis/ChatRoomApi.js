// src/api/chatApi.js
import axios from "axios";

const CHAT_API_URL = "/api/chat/room";

export const createChatRoom = async (receiverIds, title) => {
  try {
    const response = await axios.post(
      CHAT_API_URL,
      { receiverIds, title },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("🚨 채팅방 생성 오류:", error);
    throw error;
  }
};

export const getChatRooms = async () => {
  try {
    const response = await axios.get(`${CHAT_API_URL}s`);
    return response.data;
  } catch (error) {
    console.error("채팅방 조회 오류 : ", error);
    throw error;
  }
};

export const getChatHistory = async (chatRoomId) => {
  try {
    const response = await axios.get(`/api/chats?chatRoomId=${chatRoomId}`);
    return response.data;
  } catch (error) {
    console.error("채팅 내역 불러오기 실패:", error);
    throw error;
  }
};

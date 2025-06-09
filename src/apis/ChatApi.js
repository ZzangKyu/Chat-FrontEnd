import axios from "axios";

const CHAT_API_URL = "/api/chat";

export const getChatHistory = async (chatRoomId) => {
    try {
        const response = await axios.get(`${CHAT_API_URL}s`, {
            params: { chatRoomId }, // ✅ 쿼리 파라미터로 전달
        });
        return response.data;
    } catch (error) {
        console.error("채팅이력 조회 오류 : ", error);
        throw error;
    }
}
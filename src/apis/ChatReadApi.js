import axios from "axios";

const CHAT_READ_API_URL = "/api/chat/read";

export const getLastChatReads = async (chatRoomId) => {
    try {
        const response = await axios.get(`${CHAT_READ_API_URL}s`, {
            params: { chatRoomId }, // ✅ 쿼리 파라미터로 전달
        });
        return response.data;
    } catch (error) {
        console.error("마지막 채팅 조회 오류 : ", error);
        throw error;
    }
}
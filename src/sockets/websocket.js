// WebSocket 생성 함수 (Spring 서버에 맞게 리팩토링)
export const createWebSocket = (chatRoomId) => {
  const memberId = sessionStorage.getItem("memberId");
  if (!memberId) {
    console.error("로그인이 필요합니다.");
    return null;
  }

  const socketUrl = `ws://localhost:8080/ws/chat/room/${chatRoomId}`;
  const socket = new WebSocket(socketUrl);

  return socket;
};

export const sendMessage = (socket, message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error("🚫 WebSocket이 연결되지 않음");
  }
};

// WebSocket을 안전하게 종료하는 함수
export const closeWebSocket = (socket) => {
  if (socket) {
    console.log("socket close");
    socket.close();
  }
};
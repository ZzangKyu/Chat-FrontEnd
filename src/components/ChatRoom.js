import React, { useEffect, useState, useRef, useCallback } from "react";
import { getChatHistory } from "../apis/ChatApi";
import { createWebSocket, sendMessage, closeWebSocket } from "../sockets/websocket";
import { getLastChatReads } from "../apis/ChatReadApi"; 

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const memberId = sessionStorage.getItem("memberId");
  const nickname = sessionStorage.getItem("nickname");

  const [memberReadStates, setMemberReadStates] = useState({});

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      setError(null);
      try {
        const chatHistoryResponse = await getChatHistory(roomId);
        setMessages(chatHistoryResponse.data);

        const readStatesResponse = await getLastChatReads(roomId);
        const initialReadStates = {};
        readStatesResponse.data.forEach(read => {
          initialReadStates[read.memberId] = read.lastChatReadId;
        });
        setMemberReadStates(initialReadStates);

      } catch (err) {
        console.error("채팅 데이터 불러오기 실패:", err);
        setError("채팅 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchChatData();
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    if (!roomId || !memberId || !nickname) {
      console.log("WebSocket 연결 조건 미달: roomId, memberId, 또는 nickname이 없음");
      return;
    }

    const socket = createWebSocket(roomId);
    socketRef.current = socket;

    if (socket) {
      socket.onopen = () => {
        console.log(`✅ WebSocket 연결 성공 (Room: ${roomId})`);
        const enterMessage = {
          messageType: "ENTER",
          chatRoomId: Number(roomId),
          senderId: Number(memberId),
          senderNickname: nickname,
        };
        sendMessage(socket.current, JSON.stringify(enterMessage));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.messageType) {
            case "CHAT_MESSAGE":
              setMessages((prev) => [...prev, data]);
              break;
            case "ENTER":
              setMessages((prev) => [...prev, data]);
              break;
            case "READ_RECEIPT_UPDATE":
              setMemberReadStates((prevReadStates) => ({
                ...prevReadStates,
                [data.readerId]: data.lastReadChatId,
              }));
              break;
            default:
              console.log("📩 받은 메시지:", data);
          }
        } catch (error) {
          console.error("메시지 파싱 오류:", error);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket 연결 종료");
      };

      socket.onerror = (error) => {
        console.error("WebSocket 오류:", error);
      };
    }

    return () => {
      if (socketRef.current) {
        console.log("Cleanup: Closing WebSocket connection.");
        closeWebSocket(socketRef.current);
        socketRef.current = null;
      }
    };
  }, [roomId, memberId, nickname]);

  const formatTimeKakao = (dateString) => { 
    const messageDate = new Date(dateString);
    const currentDate = new Date();

    const isToday =
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getDate() === currentDate.getDate();

    const isYesterday =
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getDate() === currentDate.getDate() - 1;

    const formatAMPM = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "오후" : "오전";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };

    if (isToday) {
      return formatAMPM(messageDate);
    } else if (isYesterday) {
      return `어제 ${formatAMPM(messageDate)}`;
    } else {
      const year = messageDate.getFullYear();
      const month = messageDate.getMonth() + 1;
      const day = messageDate.getDate();
      return `${year}. ${month < 10 ? `0${month}` : month}. ${
        day < 10 ? `0${day}` : day
      }. ${formatAMPM(messageDate)}`;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const chatMessage = {
        messageType: "TALK",
        chatRoomId: Number(roomId),
        senderId: Number(memberId),
        senderNickname: nickname,
        message: newMessage,
      };
      sendMessage(socketRef.current, JSON.stringify(chatMessage));
      setNewMessage("");
    } else if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("🚫 WebSocket 연결이 되어 있지 않습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const calculateUnReadCount = useCallback((msgChatId) => {
    let unreadCount = 0;
    for (const id in memberReadStates) {
      if (Number(id) === Number(memberId)) { 
        continue;
      }
      if (memberReadStates[id] < msgChatId) {
        unreadCount++;
      }
    }
    return unreadCount;
  }, [memberReadStates, memberId]); 

  if (loading) {
    return <div className="flex justify-center items-center h-full bg-black text-white">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 bg-black text-white">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="space-y-2 p-4 overflow-y-auto flex-1">
        {messages.map((msg) => {
          const isMine = msg.senderId === Number(memberId);
          const messageTime = formatTimeKakao(msg.createDate || msg.createdDate);
          
          const unReadCount = msg.chatId ? calculateUnReadCount(msg.chatId) : 0;

          return (
            <div key={msg.chatId}>
              {!isMine && msg.senderNickname && ( 
                <div className="text-sm font-bold text-blue-300 ml-2 mb-1">
                  {msg.senderNickname}
                </div>
              )}
              <div
                className={`flex ${isMine ? "justify-end" : "justify-start"} items-end`}
              >
                {unReadCount > 0 && ( 
                  <div className={`text-xs text-lime-400 ${isMine ? 'mr-1' : 'order-last ml-1'}`}>
                    {unReadCount}
                  </div>
                )}
                
                <div className={`text-xs mt-1 ${isMine ? 'text-white mr-1' : 'text-gray-500 order-last ml-1'}`}>
                  {messageTime}
                </div>

                {/* ⭐ 이 부분이 핵심입니다: 내가 보낸 메시지 배경색을 blue-600으로 다시 설정 */}
                <div
                  className={`bg-${
                    isMine ? "blue-600 text-white" : "gray-700 text-gray-200"
                  } rounded-lg p-2 max-w-xs break-words`}
                >
                  <div>{msg.message}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-4 border-t border-gray-700">
        <textarea
          className="flex-1 h-12 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 resize-none bg-gray-800 text-white mr-2"
          placeholder="메시지를 입력하세요."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          onClick={handleSendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
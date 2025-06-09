import React, { useEffect, useState } from "react";
import { getMembers } from "../apis/MemberApi";
import { createChatRoom } from "../apis/ChatRoomApi";

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState(new Set());
    const [chatRoomTitle, setChatRoomTitle] = useState("");

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await getMembers();
                if (response.status === "OK") {
                    setMembers(response.data);
                } else {
                    alert("사용자 목록을 불러오는데 실패했습니다.");
                }
            } catch (error) {
                console.error("사용자 정보 조회 중 오류 발생:", error);
            }
        };

        fetchMembers();
    }, []);

    // ✅ 체크박스 선택 핸들러
    const handleCheckboxChange = (memberId) => {
        setSelectedMembers((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(memberId)) {
                newSelected.delete(memberId);
            } else {
                newSelected.add(memberId);
            }
            return newSelected;
        });
    };

    // ✅ 단체 채팅방 생성 함수
    const handleCreateChatRoom = async () => {
        if (selectedMembers.size === 0) {
            alert("최소 한 명 이상 선택해주세요!");
            return;
        }

        try {
            const response = await createChatRoom(Array.from(selectedMembers), chatRoomTitle);
            if (response.status === "OK") {
                alert("채팅방이 생성되었습니다.");
            } else {
                alert("채팅방 생성에 실패했습니다.");
            }
        } catch (error) {
            console.error("채팅방 생성 중 오류 발생:", error);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-black text-white p-5">
            <h1 className="text-2xl font-bold mb-5">사용자 목록</h1>
            <input 
                type="text"
                placeholder="채팅방 제목을 입력하세요 (선택 사항)"
                value={chatRoomTitle}
                onChange={(e) => setChatRoomTitle(e.target.value)}
                className="mb-3 p-2 w-80 bg-gray-700 text-white rounded"
            />
            <ul className="w-80 bg-gray-800 p-4 rounded">
                {members.length > 0 ? (
                    members.map((member) => (
                        <li key={member.memberId} className="p-2 border-b border-gray-600 flex justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.has(member.memberId)}
                                    onChange={() => handleCheckboxChange(member.memberId)}
                                    className="mr-2"
                                />
                                <span>{member.nickname}</span>
                            </label>
                        </li>
                    ))
                ) : (
                    <p>불러오는 중...</p>
                )}
            </ul>
            <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreateChatRoom}
            >
                선택한 사용자와 채팅방 만들기
            </button>
        </div>
    );
};

export default MemberList;

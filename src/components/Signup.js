import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../apis/MemberApi";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        const response = await signup(username, password, nickname);
        if (response.status === "OK") {
            alert("회원가입 성공! 로그인하세요.");
            navigate("/");
        } else {
            alert("회원가입 실패");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-4xl font-bold mb-8 text-gray-300">회원가입</h1>
            <div className="w-80">
                <input 
                    type="text" 
                    placeholder="아이디" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mb-3 text-lg bg-[#222] border border-[#444] rounded-lg outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
                <input 
                    type="password" 
                    placeholder="비밀번호" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-3 text-lg bg-[#222] border border-[#444] rounded-lg outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
                <input 
                    type="text" 
                    placeholder="닉네임" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-3 mb-5 text-lg bg-[#222] border border-[#444] rounded-lg outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />
                <button 
                    onClick={handleSignup} 
                    className="w-full py-3 text-lg font-semibold bg-[#333] hover:bg-[#00AEEF] text-white rounded-lg transition-all shadow-lg hover:shadow-[#00AEEF]/50">
                    회원가입
                </button>
                <button 
                    onClick={() => navigate("/")} 
                    className="mt-4 w-full text-gray-500 hover:text-gray-300 transition">
                    로그인
                </button>
            </div>
        </div>
    );
}

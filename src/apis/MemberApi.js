import axios from "axios";

const API_BASE_URL = "/api/member";

export const signup = async (username, password, nickname) => {
    try {
        const response = await axios.post(API_BASE_URL, {
            username,
            password,
            nickname
        });
        return response.data;
    } catch (error) {
        console.error("🚨 회원가입 오류:", error);
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error("🚨 로그인 오류:", error);
        throw error;
    }
};

export const getMembers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}s`);
        return response.data;
    } catch (error) {
        console.error("🚨 사용자 목록 조회 오류:", error);
        throw error;
    }
};

import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatPage from "./components/ChatPage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat-page" element={<ChatPage />} />
        </Routes>
    );
}

export default AppRoutes;

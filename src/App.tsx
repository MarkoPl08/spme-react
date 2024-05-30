import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './pages/UserDashboard';
import ProtectedRoute from "./routes/ProtectedRoute";
import EmailLoginComponent from "./pages/auth/EmailLoginComponent.tsx";
import MainLoginComponent from "./pages/auth/Login";
import {useState} from "react";
import {User} from "./types/auth.ts";

function App() {
    const [user, setUser] = useState<User | null>(null);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<MainLoginComponent />} />
                <Route path="/login" element={<EmailLoginComponent setUser={setUser} user={user} />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;

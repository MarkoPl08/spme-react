import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './pages/UserDashboard';
import ProtectedRoute from "./routes/ProtectedRoute";
import EmailLoginComponent from "./pages/auth/EmailLoginComponent.tsx";
import MainLoginComponent from "./pages/auth/Login";
import {useState} from "react";
import {User} from "./types/auth.ts";
import PhotoUpload from "./pages/PhotoUpload.tsx";
import PhotoGallery from "./pages/PhotoGallery.tsx";

function App() {
    const [user, setUser] = useState<User | null>(null);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<MainLoginComponent />} />
                <Route path="/login" element={<EmailLoginComponent setUser={setUser} user={user} />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><PhotoUpload /></ProtectedRoute>} />
                <Route path="/photo-gallery" element={<ProtectedRoute><PhotoGallery /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to={user ? '/dashboard' : '/register'} />} />
                <Route path="*" element={<Navigate to="/register" />} />
            </Routes>
        </Router>
    );
}

export default App;

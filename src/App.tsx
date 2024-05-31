import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/UserDashboard';
import ProtectedRoute from "./routes/ProtectedRoute";
import EmailLoginComponent from "./pages/auth/EmailLoginComponent";
import MainLoginComponent from "./pages/auth/Login";
import { useState } from "react";
import { User } from "./types/auth";
import PhotoUpload from "./pages/PhotoUpload";
import PhotoGallery from "./pages/PhotoGallery";
import AdminDashboard from "./pages/AdminDashboard";

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
                <Route path="/admin" element={<ProtectedRoute requiredRole={1}><AdminDashboard /></ProtectedRoute>} /> {/* Assuming admin role is 1 */}
                <Route path="/" element={<Navigate to={user ? '/dashboard' : '/register'} />} />
                <Route path="*" element={<Navigate to="/register" />} />
            </Routes>
        </Router>
    );
}

export default App;

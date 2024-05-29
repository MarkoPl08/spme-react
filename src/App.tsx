import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/Register';
import Dashboard from './pages/UserDashboard';
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthWrapper from "./hooks/AuthWrapper";

function App() {
    return (
        <Router>
            <AuthWrapper>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthWrapper>
        </Router>
    );
}

export default App;

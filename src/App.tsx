import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/UserDashboard.tsx';
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import AuthWrapper from "./hooks/AuthWrapper.tsx";

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

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './pages/UserDashboard';
import ProtectedRoute from "./routes/ProtectedRoute";
import EmailLoginComponent from "./pages/auth/EmailLoginComponent";
import {useEffect, useState} from 'react';
import {User} from './types/auth';
import PhotoUpload from './pages/PhotoUpload';
import PhotoGallery from './pages/PhotoGallery';
import AdminDashboard from './pages/AdminDashboard';
import CenteredLayout from './components/CenteredLayout';
import Navbar from './navigation/Navbar';
import MainLoginComponent from "./pages/auth/Login.tsx";
import {parseJwt} from "./helpers/parseJwt.tsx";
import Home from "./pages/Home.tsx";

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedUser = parseJwt(token);
            console.log('Decoded user:', decodedUser);
            setUser({
                UserID: decodedUser.userId,
                Email: decodedUser.email,
                RoleID: decodedUser.role,
                name: ''
            });
        }
        console.log('App user state:', user);
    }, []);

    return (
        <Router>
            <Navbar user={user}/>
            <Routes>
                <Route path="/" element={<CenteredLayout><Home /></CenteredLayout>} />
                <Route path="/register" element={<CenteredLayout><MainLoginComponent/></CenteredLayout>}/>
                <Route path="/login"
                       element={<CenteredLayout><EmailLoginComponent setUser={setUser} user={user}/></CenteredLayout>}/>
                <Route path="/dashboard"
                       element={<CenteredLayout><ProtectedRoute><Dashboard/></ProtectedRoute></CenteredLayout>}/>
                <Route path="/upload"
                       element={<CenteredLayout><ProtectedRoute><PhotoUpload/></ProtectedRoute></CenteredLayout>}/>
                <Route path="/photo-gallery"
                       element={<CenteredLayout><ProtectedRoute><PhotoGallery/></ProtectedRoute></CenteredLayout>}/>
                <Route path="/admin" element={<CenteredLayout><ProtectedRoute
                    requiredRole={1}><AdminDashboard/></ProtectedRoute></CenteredLayout>}/>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;

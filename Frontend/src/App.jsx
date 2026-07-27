import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';



const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner fullscreen/>;
    return user ? <Navigate to="/" replace /> : children;
};

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>

                        }
                    />
                    <Route
                        path="/register"
                        element={

                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={

                          <Dashboard/>

                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Importar axios
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Chat from './components/Chat';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userName, setUserName] = useState('');

    const setAndStoreToken = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
    };

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    };

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:3000/api/profile', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                setUserName(response.data.name);
            })
            .catch(error => {
                console.error('Erro ao carregar perfil do usuário.', error);
            });
        }
    }, [token]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login setToken={setAndStoreToken} />} />
                <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute token={token}>
                            <Dashboard token={token} handleLogout={handleLogout} userName={userName} />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/chat/:roomId" 
                    element={
                        <PrivateRoute token={token}>
                            <Chat token={token} userName={userName} />
                        </PrivateRoute>
                    } 
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;

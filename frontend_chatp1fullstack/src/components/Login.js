import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { email, password });
            setToken(response.data.token);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Erro ao fazer login. Tente novamente.');
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errorMessage && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Login
                    </Button>
                    <Typography variant="body2">
                        Não tem uma conta? <Link to="/register">Registrar</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;

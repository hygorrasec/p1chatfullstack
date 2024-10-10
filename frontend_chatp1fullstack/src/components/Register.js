import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', { name, email, password });
            setErrorMessage('Usuário registrado com sucesso! Agora você pode fazer login.');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Erro ao registrar usuário.');
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Cadastro
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                        <Typography color={errorMessage.includes('sucesso') ? 'success' : 'error'} variant="body2" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Registrar
                    </Button>
                    <Typography variant="body2">
                        Já tem uma conta? <Link to="/">Entrar</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;

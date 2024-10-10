import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h1" color="primary" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Página não encontrada
            </Typography>
            <Typography variant="body1" gutterBottom>
                Desculpe, a página que você está tentando acessar não existe.
            </Typography>
            <Box mt={4}>
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Voltar para a tela inicial
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;

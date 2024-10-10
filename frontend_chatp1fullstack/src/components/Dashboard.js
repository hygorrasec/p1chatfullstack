import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, CardActions, TextField, Container, GlobalStyles } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Para navegação

const Dashboard = ({ token, handleLogout }) => {
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();  // Navegar para o chat

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/rooms', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const roomsWithCreators = await Promise.all(response.data.map(async (room) => {
                    if (room.createdBy) {
                        try {
                            const userResponse = await axios.get(`http://localhost:3000/api/profile/${room.createdBy}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            return { ...room, createdByName: userResponse.data.name };
                        } catch (error) {
                            return { ...room, createdByName: 'Desconhecido' };
                        }
                    } else {
                        return { ...room, createdByName: 'Desconhecido' };
                    }
                }));

                setRooms(roomsWithCreators);
            } catch (error) {
                alert('Erro ao carregar as salas.');
            }
        };

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserName(response.data.name);
                setUserId(response.data.id);
            } catch (error) {
                alert('Erro ao carregar perfil do usuário.');
            }
        };

        fetchRooms();
        fetchUserProfile();
    }, [token]);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            // Checa se a capacidade está dentro do limite
            if (capacity > 20) {
                setErrorMessage('Capacidade não pode ser maior que 20.');
                return;
            }
    
            const response = await axios.post(
                'http://localhost:3000/api/rooms',
                { name, description, capacity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Adiciona o nome do usuário criador diretamente ao objeto da sala recém-criada
            const newRoom = {
                ...response.data,
                createdByName: userName, // Adiciona o nome do criador diretamente
            };
    
            // Atualiza as salas com a nova sala, incluindo o nome do criador
            setRooms([...rooms, newRoom]);
    
            // Limpa os campos
            setName('');
            setDescription('');
            setCapacity('');
            setErrorMessage('');
        } catch (error) {
            alert('Erro ao criar sala.');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            await axios.delete(`http://localhost:3000/api/rooms/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRooms(rooms.filter((room) => room._id !== roomId));
        } catch (error) {
            alert('Erro ao excluir sala.');
        }
    };

    const handleJoinRoom = async (room) => {
        try {
            // Verificação da capacidade da sala via API
            const response = await axios.get(`http://localhost:3000/api/rooms/${room._id}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const currentUsers = response.data.connectedUsers;

            // Verifica se a sala está cheia
            if (currentUsers >= room.capacity) {
                setErrorMessage(`A sala "${room.name}" já está cheia. Capacidade máxima: ${room.capacity}. Espere esvaziar ou entre em outra sala.`);
                return;
            }

            // Se a sala não estiver cheia, navega para o chat
            navigate(`/chat/${room._id}`);
        } catch (error) {
            alert('Erro ao verificar a capacidade da sala.');
        }
    };

    return (
        <>
            <GlobalStyles styles={{
                body: { 
                    backgroundColor: '#1c1c1c',
                    color: 'white'
                },
            }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar position="fixed" sx={{ bgcolor: '#2c2c2c' }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: 'white' }}>
                            Bem-vindo(a), {userName}!
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Sair
                        </Button>
                    </Toolbar>
                </AppBar>
                
                <Container component="main" sx={{ flexGrow: 1, bgcolor: '#1c1c1c', p: 3, mt: 8 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                        Criar uma nova sala
                    </Typography>
                    <form onSubmit={handleCreateRoom}>
                        <TextField
                            label="Nome da Sala"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            inputProps={{
                                maxLength: 20,
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            sx={{ bgcolor: '#424242', borderRadius: 2 }}
                        />
                        <TextField
                            label="Descrição"
                            fullWidth
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            inputProps={{
                                maxLength: 100,
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            sx={{ bgcolor: '#424242', borderRadius: 2 }}
                        />
                        <TextField
                            label="Capacidade"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={capacity}
                            onChange={(e) => setCapacity(Math.min(20, e.target.value))}
                            required
                            inputProps={{
                                max: 20,
                            }}
                            InputLabelProps={{ style: { color: 'white' } }}
                            InputProps={{ style: { color: 'white' } }}
                            sx={{ bgcolor: '#424242', borderRadius: 2 }}
                        />
                        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                            Criar Sala
                        </Button>
                    </form>

                    {errorMessage && (
                        <Typography variant="body1" sx={{ color: 'red', mt: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    <Typography variant="h5" sx={{ mt: 4, color: 'white' }}>
                        Salas Criadas
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {rooms.map((room) => (
                            <Grid item xs={12} sm={6} md={4} key={room._id}>
                                <Card sx={{ bgcolor: '#2c2c2c', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h6"><strong>{room.name}</strong></Typography>
                                        <Typography variant="body2">Capacidade: {room.capacity}</Typography>
                                        <Typography variant="body2" mt={2}>
                                            <strong>Sobre a sala:</strong> <i>{room.description}</i>
                                        </Typography>
                                        <Typography variant="body2" mt={2}>
                                            <strong>Criado por:</strong> {room.createdByName}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" onClick={() => handleJoinRoom(room)}>
                                            Entrar no Chat
                                        </Button>
                                        {String(room.createdBy) === String(userId) && (
                                            <Button
                                                size="small"
                                                color="secondary"
                                                onClick={() => handleDeleteRoom(room._id)}
                                            >
                                                Excluir
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default Dashboard;

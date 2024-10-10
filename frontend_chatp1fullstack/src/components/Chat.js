import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Container, Paper, IconButton, GlobalStyles } from '@mui/material';
import io from 'socket.io-client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const generateUserColor = (index) => {
    const colors = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#ba68c8', '#4db6ac', '#ff8a65'];
    return colors[index % colors.length];
};

const Chat = ({ userName }) => {
    const { roomId } = useParams();
    const navigate = useNavigate();  
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        const checkRoomCapacity = async () => {
            if (userName && !socketRef.current) {
                socketRef.current = io('http://localhost:3000', {
                    transports: ['websocket'],
                });
    
                socketRef.current.on('connect', () => {
                    socketRef.current.emit('join-room', { roomId, userName });
                });
    
                socketRef.current.on('room-full', (data) => {
                    // Exibe alerta e redireciona o usuário de volta ao dashboard se a sala estiver cheia
                    alert(data.message);
                    navigate('/dashboard');
                });
    
                socketRef.current.on('receive-message', (data) => {
                    setMessages((prev) => [data, ...prev]);
                });
    
                socketRef.current.on('update-users', (usersInRoom) => {
                    setUsers(usersInRoom.map(user => user.name));
                });
    
                socketRef.current.on('disconnect', () => {
                    console.log('Desconectado do servidor Socket.IO');
                });
    
                return () => {
                    socketRef.current.emit('leave-room', { roomId });
                    socketRef.current.disconnect();
                    socketRef.current = null;
                };
            }
        };
    
        checkRoomCapacity();
    }, [roomId, userName, navigate]);

    const handleSendMessage = () => {
        if (message.trim() && socketRef.current) {
            socketRef.current.emit('send-message', { roomId, message, userName });
            setMessage('');
        }
    };

    const handleLeaveChat = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <GlobalStyles styles={{
                body: { 
                    backgroundColor: '#1c1c1c',  
                    color: 'white'
                },
            }} />

            <Container sx={{
                p: 3, 
                height: '90vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                bgcolor: '#1c1c1c'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={handleLeaveChat} sx={{ mr: 2 }}>
                        <ArrowBackIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>Chat da Sala {roomId}</Typography>
                </Box>

                <Typography variant="body1" sx={{ color: 'gray', mb: 2 }}>
                    Olá, você está conectado(a) com o usuário <strong><u>{userName}</u></strong>!
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    height: '70vh',
                    position: 'relative'
                }}>
                    {/* Área do chat */}
                    <Box sx={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        overflowY: 'auto',
                        mr: { md: 2 },
                        bgcolor: '#2c2c2c',
                        p: 1,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <List sx={{ flex: 1 }}>
                            {messages.map((msg, index) => (
                                <ListItem key={index} sx={{ mb: -1 }}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 1,
                                            bgcolor: msg.userName === userName ? '#4caf50' : '#424242',
                                            color: 'white',
                                            borderRadius: 2
                                        }}
                                    >
                                        <ListItemText primary={`${msg.userName}: ${msg.message}`} />
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* Lista de usuários conectados */}
                    <Box sx={{
                        flex: 1,
                        mt: { xs: 2, md: 0 },
                        bgcolor: '#383838',
                        p: 2,
                        borderRadius: 2,
                        overflowY: 'auto',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        maxHeight: '100%'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Usuários Conectados</Typography>
                        <List>
                            {users.map((user, index) => (
                                <ListItem key={index} sx={{
                                    mb: 0.5,
                                    bgcolor: generateUserColor(index),
                                    borderRadius: 1,
                                    p: 0.5,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <ListItemText primary={user} sx={{ textAlign: 'center', color: 'white' }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                </Box>

                <Box display="flex" alignItems="center" sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,  
                    width: '100%',
                    maxWidth: '1115px',  
                    mx: 'auto',  
                    bgcolor: '#1c1c1c',
                    p: 2,
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                    <TextField
                        fullWidth
                        value={message}
                        onChange={(e) => {
                            if (e.target.value.length <= 200) {
                                setMessage(e.target.value);
                            }
                        }}
                        placeholder="Digite sua mensagem"
                        variant="outlined"
                        inputProps={{
                            maxLength: 200,
                            autoComplete: 'off',  
                        }}
                        sx={{
                            bgcolor: '#424242',
                            color: 'white',
                            borderRadius: 2,
                            input: { color: 'white' }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        sx={{ ml: 2, height: '100%', mr: 4 }}
                    >
                        Enviar
                    </Button>
                </Box>

            </Container>
        </>
    );
};

export default Chat;

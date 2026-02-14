import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Fab,
    Paper,
    Typography,
    TextField,
    IconButton,
    Fade,
    CircularProgress,
    Avatar,
} from '@mui/material';
import {
    SmartToy,
    Close,
    Send,
    Psychology,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { generateAIResponse, isGeminiInitialized } from '../services/gemini';
import { useStore } from '../store';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const getPageContext = (pathname: string): string => {
    const pageContextMap: Record<string, string> = {
        '/': 'dashboard showing overall progress, stats, and quick actions',
        '/goals': 'goals page for setting and tracking long-term objectives',
        '/tasks': 'tasks page for managing to-do items and priorities',
        '/habits': 'habits page for building and tracking daily routines',
        '/finance': 'finance page for tracking income, expenses, and budgets',
        '/health': 'health page for tracking workouts, water, sleep, and mood',
        '/learning': 'learning page for courses, books, and skill development',
        '/ideas': 'ideas page for capturing and organizing thoughts',
        '/focus': 'focus page with pomodoro timer and deep work sessions',
        '/analytics': 'analytics page with charts and progress insights',
        '/settings': 'settings page for app configuration and preferences',
    };
    return pageContextMap[pathname] || 'the application';
};

export default function AIChatbot() {
    const location = useLocation();
    const { user, tasks, goals, habits } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const buildSystemContext = (): string => {
        const pageContext = getPageContext(location.pathname);
        const completedTasks = tasks.filter(t => t.completed).length;
        const activeGoals = goals.filter(g => !g.completedAt).length;
        const activeHabits = habits.length;

        return `You are a helpful AI assistant for LifeOS, a personal life management app. 
The user "${user.name}" is currently on the ${pageContext}.

Quick stats:
- ${completedTasks}/${tasks.length} tasks completed
- ${activeGoals} active goals
- ${activeHabits} habits being tracked
- Level ${user.level} with ${user.xp} XP

Be helpful, encouraging, and concise. Keep responses under 3 sentences unless asked for more detail.
Provide actionable advice related to productivity, habits, goals, and personal growth.`;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!isGeminiInitialized()) {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "I'm not connected yet! Please add your Gemini API key in Settings → AI Integration to enable AI features. 🔑",
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
            } else {
                const prompt = `${buildSystemContext()}\n\nUser: ${input.trim()}\n\nAssistant:`;
                const response = await generateAIResponse(prompt);

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Oops! Something went wrong. Please try again. 🤖",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <Fab
                color="primary"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1300,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 12px 40px rgba(14, 165, 233, 0.5)',
                    },
                }}
            >
                {isOpen ? <Close /> : <SmartToy />}
            </Fab>

            {/* Chat Panel */}
            <Fade in={isOpen}>
                <Paper
                    elevation={24}
                    sx={{
                        position: 'fixed',
                        bottom: 96,
                        right: 24,
                        width: 380,
                        maxWidth: 'calc(100vw - 48px)',
                        height: 500,
                        maxHeight: 'calc(100vh - 150px)',
                        zIndex: 1299,
                        borderRadius: 4,
                        overflow: 'hidden',
                        display: isOpen ? 'flex' : 'none',
                        flexDirection: 'column',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                                width: 40,
                                height: 40,
                            }}
                        >
                            <Psychology />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                LifeOS Assistant
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Powered by Gemini AI
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsOpen(false)}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {messages.length === 0 && (
                            <Box
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    opacity: 0.7,
                                }}
                            >
                                <SmartToy sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Hi {user.name}! 👋 How can I help you today?
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                    Ask me about your goals, tasks, habits, or anything else!
                                </Typography>
                            </Box>
                        )}

                        {messages.map((msg) => (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '85%',
                                        p: 1.5,
                                        borderRadius: 2,
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)'
                                            : 'rgba(255, 255, 255, 0.08)',
                                        boxShadow: msg.role === 'user'
                                            ? '0 4px 15px rgba(14, 165, 233, 0.3)'
                                            : 'none',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {msg.content}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}

                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress size={16} />
                                    <Typography variant="body2" color="text.secondary">
                                        Thinking...
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                            }}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            sx={{
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                                    opacity: 0.9,
                                },
                                '&:disabled': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        >
                            <Send fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            </Fade>
        </>
    );
}

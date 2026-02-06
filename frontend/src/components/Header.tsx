import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Avatar,
    Typography,
    Tooltip,
} from '@mui/material';
import {
    Login as LoginIcon,
    Logout as LogoutIcon,
    PersonAdd as SignUpIcon,
} from '@mui/icons-material';
import { useStore } from '../store';
import { setAuthToken } from '../services/api';

export default function Header() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useStore();

    const handleLogout = () => {
        setAuthToken(null);
        logout();
        navigate('/login');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
                mb: 3,
                p: 2,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.8) 0%, rgba(28, 28, 40, 0.6) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
        >
            {isAuthenticated ? (
                <>
                    {/* User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 'auto' }}>
                        <Box
                            sx={{
                                p: '2px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                                borderRadius: '50%',
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    background: '#16161f',
                                    fontSize: 14,
                                    fontWeight: 700,
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                                {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b8b9a' }}>
                                Level {user.level} • {user.xp} XP
                            </Typography>
                        </Box>
                    </Box>

                    {/* Sign Out Button */}
                    <Tooltip title="Sign Out" arrow>
                        <Button
                            variant="outlined"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                borderColor: 'rgba(255, 107, 107, 0.4)',
                                color: '#ff6b6b',
                                px: 2.5,
                                py: 1,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: '#ff6b6b',
                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                },
                            }}
                        >
                            Sign Out
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <>
                    {/* Welcome Text */}
                    <Typography
                        variant="body2"
                        sx={{ mr: 'auto', color: '#8b8b9a', fontWeight: 500 }}
                    >
                        Welcome to LifeOS
                    </Typography>

                    {/* Sign In Button */}
                    <Button
                        variant="outlined"
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                        sx={{
                            borderColor: 'rgba(78, 205, 196, 0.4)',
                            color: '#4ecdc4',
                            px: 2.5,
                            py: 1,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                borderColor: '#4ecdc4',
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                            },
                        }}
                    >
                        Sign In
                    </Button>

                    {/* Sign Up Button */}
                    <Button
                        variant="contained"
                        startIcon={<SignUpIcon />}
                        onClick={() => navigate('/register')}
                        sx={{
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #e55a5a 100%)',
                            color: '#ffffff',
                            px: 2.5,
                            py: 1,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #ff8585 0%, #ff6b6b 100%)',
                                boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                            },
                        }}
                    >
                        Sign Up
                    </Button>
                </>
            )}
        </Box>
    );
}

import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    IconButton,
    Divider,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Flag as GoalsIcon,
    CheckCircle as TasksIcon,
    LocalFireDepartment as HabitsIcon,
    AccountBalance as FinanceIcon,
    FitnessCenter as HealthIcon,
    School as LearningIcon,
    Lightbulb as IdeasIcon,
    Timer as FocusIcon,
    BarChart as AnalyticsIcon,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
} from '@mui/icons-material';
import { useStore } from '../store';
import { getGreeting, getXPProgress } from '../utils/helpers';

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

const menuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/goals', label: 'Goals', icon: <GoalsIcon /> },
    { path: '/tasks', label: 'Tasks', icon: <TasksIcon /> },
    { path: '/habits', label: 'Habits', icon: <HabitsIcon /> },
    { path: '/finance', label: 'Finance', icon: <FinanceIcon /> },
    { path: '/health', label: 'Health', icon: <HealthIcon /> },
    { path: '/learning', label: 'Learning', icon: <LearningIcon /> },
    { path: '/ideas', label: 'Ideas', icon: <IdeasIcon /> },
    { path: '/focus', label: 'Focus', icon: <FocusIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useStore();
    const xpProgress = getXPProgress(user.xp);

    const drawerWidth = open ? 280 : 80;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s ease',
                    overflowX: 'hidden',
                    background: 'linear-gradient(180deg, rgba(18, 18, 26, 0.98) 0%, rgba(10, 10, 15, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                },
            }}
        >
            {/* Header with Logo and Toggle */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'space-between' : 'center',
                    minHeight: 64,
                }}
            >
                {open && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #e55a5a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                            }}
                        >
                            <Typography sx={{ fontSize: 18 }}>🚀</Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8585 50%, #4ecdc4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            LifeOS
                        </Typography>
                    </Box>
                )}

                {/* Toggle Button - Always Visible */}
                <IconButton
                    onClick={onToggle}
                    sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        color: '#ff6b6b',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                        },
                    }}
                >
                    {open ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
                </IconButton>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

            {/* User Profile */}
            <Box sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        justifyContent: open ? 'flex-start' : 'center',
                    }}
                >
                    <Box
                        sx={{
                            p: '3px',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                            borderRadius: '50%',
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                background: '#16161f',
                                fontSize: 15,
                                fontWeight: 700,
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>
                    {open && (
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {getGreeting()}, {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b8b9a' }}>
                                Level {user.level} • {user.xp} XP
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* XP Bar */}
                {open && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#5a5a6a' }}>
                                Level {user.level}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ff6b6b', fontWeight: 600 }}>
                                {xpProgress.current}/{xpProgress.required} XP
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                height: 6,
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: 3,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    width: `${xpProgress.percentage}%`,
                                    background: 'linear-gradient(90deg, #ff6b6b, #ff8585, #4ecdc4)',
                                    borderRadius: 3,
                                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

            {/* Navigation */}
            <List sx={{ flex: 1, py: 1, px: open ? 1 : 0.5 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Tooltip
                            key={item.path}
                            title={!open ? item.label : ''}
                            placement="right"
                            arrow
                        >
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    minHeight: 44,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: open ? 2 : 1.5,
                                    mx: open ? 0.5 : 0.25,
                                    my: 0.3,
                                    borderRadius: '10px',
                                    backgroundColor: isActive ? 'rgba(255, 107, 107, 0.12)' : 'transparent',
                                    borderLeft: isActive ? '3px solid #ff6b6b' : '3px solid transparent',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 107, 0.08)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : 0,
                                        justifyContent: 'center',
                                        color: isActive ? '#ff6b6b' : '#8b8b9a',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {open && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 600 : 500,
                                            color: isActive ? '#ffffff' : '#8b8b9a',
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </Tooltip>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

            {/* Settings */}
            <List sx={{ px: open ? 1 : 0.5 }}>
                <Tooltip title={!open ? 'Settings' : ''} placement="right" arrow>
                    <ListItemButton
                        onClick={() => navigate('/settings')}
                        sx={{
                            minHeight: 44,
                            justifyContent: open ? 'initial' : 'center',
                            px: open ? 2 : 1.5,
                            mx: open ? 0.5 : 0.25,
                            my: 0.5,
                            borderRadius: '10px',
                            backgroundColor: location.pathname === '/settings' ? 'rgba(255, 107, 107, 0.12)' : 'transparent',
                            borderLeft: location.pathname === '/settings' ? '3px solid #ff6b6b' : '3px solid transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 2 : 0,
                                justifyContent: 'center',
                                color: location.pathname === '/settings' ? '#ff6b6b' : '#8b8b9a',
                            }}
                        >
                            <SettingsIcon />
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primary="Settings"
                                primaryTypographyProps={{
                                    fontWeight: location.pathname === '/settings' ? 600 : 500,
                                    color: location.pathname === '/settings' ? '#ffffff' : '#8b8b9a',
                                    fontSize: '0.875rem',
                                }}
                            />
                        )}
                    </ListItemButton>
                </Tooltip>
            </List>

            {/* Streak indicator */}
            {open && user.streak > 0 && (
                <Box
                    sx={{
                        m: 1.5,
                        p: 2,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 133, 133, 0.1) 100%)',
                        border: '1px solid rgba(255, 107, 107, 0.25)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: 24 }}>🔥</Typography>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ff6b6b' }}>
                                {user.streak} Day Streak!
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8b8b9a' }}>
                                Keep it going!
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </Drawer>
    );
}

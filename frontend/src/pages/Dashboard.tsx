import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Chip,
    Button,
    Skeleton,
} from '@mui/material';
import {
    Flag as GoalsIcon,
    CheckCircle as TasksIcon,
    LocalFireDepartment as HabitsIcon,
    TrendingUp,
    AutoAwesome,
    ArrowForward,
    Timer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getGreeting, formatDate, getTodayDateString, priorityColors, calculateProgress } from '../utils/helpers';
import { getMotivationalQuote, isGeminiInitialized } from '../services/gemini';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, goals, tasks, habits, focusSessions } = useStore();
    const [quote, setQuote] = useState<string>('');
    const [loadingQuote, setLoadingQuote] = useState(false);

    const today = getTodayDateString();

    // Calculate stats
    const todayTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeGoals = goals.filter(g => !g.completedAt).length;
    const todayHabits = habits.filter(h => h.completedDates.includes(today)).length;
    const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.duration, 0);

    // Get top priority tasks
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const topTasks = [...todayTasks]
        .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        .slice(0, 5);

    useEffect(() => {
        if (isGeminiInitialized() && !quote) {
            setLoadingQuote(true);
            getMotivationalQuote()
                .then(setQuote)
                .catch(() => setQuote('Every day is a new opportunity to grow.'))
                .finally(() => setLoadingQuote(false));
        }
    }, []);

    const StatCard = ({
        title,
        value,
        subtitle,
        icon,
        color,
        onClick
    }: {
        title: string;
        value: string | number;
        subtitle?: string;
        icon: React.ReactNode;
        color: string;
        onClick?: () => void;
    }) => (
        <Card
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${color}, ${color}80)`,
                },
            }}
            onClick={onClick}
            className="card-hover"
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography sx={{ color: '#8b8b9a', fontSize: '0.85rem', mb: 1.5, fontWeight: 500 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color, fontSize: '2.5rem' }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" sx={{ color: '#5a5a6a' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            backgroundColor: `${color}15`,
                            color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box className="animate-fade-in">
            {/* Header */}
            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                        background: 'linear-gradient(135deg, #ffffff 0%, #8b8b9a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {getGreeting()}, {user.name}! 👋
                </Typography>
                <Typography sx={{ color: '#8b8b9a' }}>
                    {formatDate(new Date())} • Here's your command center
                </Typography>
            </Box>

            {/* AI Quote */}
            {(quote || loadingQuote) && (
                <Card
                    sx={{
                        mb: 4,
                        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(78, 205, 196, 0.05) 100%)',
                        border: '1px solid rgba(255, 107, 107, 0.15)',
                    }}
                >
                    <CardContent sx={{ py: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #e55a5a 100%)',
                                }}
                            >
                                <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            {loadingQuote ? (
                                <Skeleton variant="text" width="100%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                            ) : (
                                <Typography sx={{ fontStyle: 'italic', color: '#ffffff' }}>"{quote}"</Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Goals"
                        value={activeGoals}
                        subtitle="In progress"
                        icon={<GoalsIcon />}
                        color="#ff6b6b"
                        onClick={() => navigate('/goals')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Tasks Pending"
                        value={todayTasks.length}
                        subtitle={`${completedTasks} completed`}
                        icon={<TasksIcon />}
                        color="#4ecdc4"
                        onClick={() => navigate('/tasks')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Habits Today"
                        value={`${todayHabits}/${habits.length}`}
                        subtitle={habits.length > 0 ? `${calculateProgress(todayHabits, habits.length)}% done` : 'No habits yet'}
                        icon={<HabitsIcon />}
                        color="#ffc107"
                        onClick={() => navigate('/habits')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Focus Time"
                        value={`${totalFocusMinutes}m`}
                        subtitle="Total focused"
                        icon={<Timer />}
                        color="#a855f7"
                        onClick={() => navigate('/focus')}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Priority Tasks */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Priority Tasks
                                </Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/tasks')}
                                    sx={{ color: '#ff6b6b' }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {topTasks.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography sx={{ color: '#8b8b9a', mb: 2 }}>
                                        No pending tasks! 🎉
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/tasks')}
                                    >
                                        Add a Task
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {topTasks.map((task) => (
                                        <Box
                                            key={task.id}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                borderLeft: `3px solid ${priorityColors[task.priority]}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 107, 107, 0.05)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography sx={{ fontWeight: 600 }}>{task.title}</Typography>
                                                <Chip
                                                    label={task.priority}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${priorityColors[task.priority]}15`,
                                                        color: priorityColors[task.priority],
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                        borderRadius: '6px',
                                                    }}
                                                />
                                            </Box>
                                            {task.dueDate && (
                                                <Typography variant="caption" sx={{ color: '#5a5a6a', mt: 0.5, display: 'block' }}>
                                                    Due: {formatDate(task.dueDate)}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Goals Progress */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Goals Progress
                                </Typography>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/goals')}
                                    sx={{ color: '#ff6b6b' }}
                                >
                                    View All
                                </Button>
                            </Box>

                            {goals.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography sx={{ color: '#8b8b9a', mb: 2 }}>
                                        No goals set yet
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/goals')}
                                    >
                                        Set a Goal
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {goals.slice(0, 4).map((goal) => (
                                        <Box key={goal.id}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {goal.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                                                    {goal.progress}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={goal.progress}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 4,
                                                        background: 'linear-gradient(90deg, #ff6b6b, #ff8585)',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<TasksIcon />}
                                    onClick={() => navigate('/tasks')}
                                >
                                    Add Task
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<HabitsIcon />}
                                    onClick={() => navigate('/habits')}
                                >
                                    Track Habit
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Timer />}
                                    onClick={() => navigate('/focus')}
                                    sx={{
                                        borderColor: '#4ecdc4',
                                        color: '#4ecdc4',
                                        '&:hover': {
                                            borderColor: '#4ecdc4',
                                            backgroundColor: 'rgba(78, 205, 196, 0.1)',
                                        },
                                    }}
                                >
                                    Start Focus
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<TrendingUp />}
                                    onClick={() => navigate('/analytics')}
                                    sx={{
                                        borderColor: '#a855f7',
                                        color: '#a855f7',
                                        '&:hover': {
                                            borderColor: '#a855f7',
                                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                        },
                                    }}
                                >
                                    View Analytics
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

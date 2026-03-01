import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    Refresh,
    Timer,
    Coffee,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, formatDuration } from '../utils/helpers';

type TimerMode = 'pomodoro' | 'short-break' | 'long-break';

const timerSettings: Record<TimerMode, number> = {
    pomodoro: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60,
};

export default function Focus() {
    const { focusSessions, addFocusSession } = useStore();
    const [mode, setMode] = useState<TimerMode>('pomodoro');
    const [timeLeft, setTimeLeft] = useState(timerSettings.pomodoro);
    const [isRunning, setIsRunning] = useState(false);
    const [completedPomodoros, setCompletedPomodoros] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const handleTimerComplete = () => {
        setIsRunning(false);

        if (mode === 'pomodoro') {
            const duration = Math.round((timerSettings.pomodoro - timeLeft) / 60) || 25;
            addFocusSession({
                id: generateId(),
                duration,
                type: 'pomodoro',
                completedAt: new Date().toISOString(),
            });
            setCompletedPomodoros((prev) => prev + 1);

            // Auto-switch to break
            const nextMode = completedPomodoros > 0 && (completedPomodoros + 1) % 4 === 0
                ? 'long-break'
                : 'short-break';
            setMode(nextMode);
            setTimeLeft(timerSettings[nextMode]);
        } else {
            // After break, switch back to pomodoro
            setMode('pomodoro');
            setTimeLeft(timerSettings.pomodoro);
        }

        // Play notification sound (optional - using browser API)
        if (Notification.permission === 'granted') {
            new Notification('LifeOS Focus', {
                body: mode === 'pomodoro' ? 'Great work! Time for a break.' : 'Break over! Ready to focus?',
            });
        }
    };

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: TimerMode | null) => {
        if (newMode) {
            setMode(newMode);
            setTimeLeft(timerSettings[newMode]);
            setIsRunning(false);
        }
    };

    const toggleTimer = () => {
        if (!isRunning) {
            startTimeRef.current = Date.now();
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(timerSettings[mode]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((timerSettings[mode] - timeLeft) / timerSettings[mode]) * 100;
    const todaySessions = focusSessions.filter(
        (s) => s.completedAt.startsWith(new Date().toISOString().split('T')[0])
    );
    const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
    const totalSessions = focusSessions.length;
    const totalMinutes = focusSessions.reduce((acc, s) => acc + s.duration, 0);

    return (
        <Box className="animate-fade-in">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Focus Mode 🧘
                </Typography>
                <Typography color="text.secondary">
                    Stay focused with the Pomodoro technique
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Today's Focus
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {formatDuration(todayMinutes)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Today's Sessions
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                {todaySessions.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Total Focus Time
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                                {formatDuration(totalMinutes)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Total Sessions
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                                {totalSessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Timer */}
            <Card sx={{ maxWidth: 500, mx: 'auto' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleModeChange}
                        sx={{ mb: 4 }}
                    >
                        <ToggleButton value="pomodoro">
                            <Timer sx={{ mr: 1 }} /> Pomodoro
                        </ToggleButton>
                        <ToggleButton value="short-break">
                            <Coffee sx={{ mr: 1 }} /> Short Break
                        </ToggleButton>
                        <ToggleButton value="long-break">
                            <Coffee sx={{ mr: 1 }} /> Long Break
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Timer Circle */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: 280,
                            height: 280,
                            mx: 'auto',
                            mb: 4,
                        }}
                    >
                        <svg
                            width="280"
                            height="280"
                            style={{ transform: 'rotate(-90deg)' }}
                        >
                            {/* Background circle */}
                            <circle
                                cx="140"
                                cy="140"
                                r="130"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.1)"
                                strokeWidth="8"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="140"
                                cy="140"
                                r="130"
                                fill="none"
                                stroke={mode === 'pomodoro' ? '#0ea5e9' : '#22c55e'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 130}
                                strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                                style={{
                                    transition: 'stroke-dashoffset 0.5s ease',
                                    filter: `drop-shadow(0 0 10px ${mode === 'pomodoro' ? 'rgba(14, 165, 233, 0.5)' : 'rgba(34, 197, 94, 0.5)'})`,
                                }}
                            />
                        </svg>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '4rem',
                                    fontFamily: 'monospace',
                                    color: mode === 'pomodoro' ? 'primary.main' : 'success.main',
                                }}
                            >
                                {formatTime(timeLeft)}
                            </Typography>
                            <Typography color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                {mode.replace('-', ' ')}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton
                            onClick={resetTimer}
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <Refresh />
                        </IconButton>
                        <Button
                            variant="contained"
                            onClick={toggleTimer}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                fontSize: '1.5rem',
                                backgroundColor: isRunning ? 'error.main' : 'primary.main',
                                '&:hover': {
                                    backgroundColor: isRunning ? 'error.dark' : 'primary.dark',
                                },
                            }}
                        >
                            {isRunning ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                        </Button>
                        <Box sx={{ width: 56 }} /> {/* Spacer */}
                    </Box>

                    {/* Pomodoro count */}
                    <Box sx={{ mt: 4 }}>
                        <Typography color="text.secondary">
                            Pomodoros completed today: <strong>{completedPomodoros}</strong>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Recent Sessions */}
            {todaySessions.length > 0 && (
                <Card sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Today's Sessions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {todaySessions.map((session) => (
                                <Box
                                    key={session.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderRadius: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Timer sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography>{session.type}</Typography>
                                    </Box>
                                    <Typography color="text.secondary">
                                        {session.duration} min
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

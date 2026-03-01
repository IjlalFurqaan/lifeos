import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    MenuItem,
    Tooltip,
} from '@mui/material';
import {
    Add,
    Delete,
    CheckCircle,
    LocalFireDepartment,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, getTodayDateString, getWeekDates } from '../utils/helpers';
import type { Habit } from '../types';

const habitIcons = ['💪', '📚', '🧘', '💧', '🏃', '😴', '🥗', '💊', '✍️', '🎵'];
const habitColors = ['#0ea5e9', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export default function Habits() {
    const { habits, addHabit, toggleHabitDay, deleteHabit } = useStore();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        frequency: 'daily' as Habit['frequency'],
        icon: '💪',
        color: '#0ea5e9',
    });

    const today = getTodayDateString();
    const weekDates = getWeekDates();

    const handleSave = () => {
        if (!formData.title.trim()) return;

        const habit: Habit = {
            id: generateId(),
            ...formData,
            streak: 0,
            bestStreak: 0,
            completedDates: [],
            createdAt: new Date().toISOString(),
        };
        addHabit(habit);
        setFormData({
            title: '',
            description: '',
            frequency: 'daily',
            icon: '💪',
            color: '#0ea5e9',
        });
        setOpen(false);
    };

    const todayCompletedCount = habits.filter((h) => h.completedDates.includes(today)).length;
    const totalStreakDays = habits.reduce((acc, h) => acc + h.streak, 0);

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Habits 🔥
                    </Typography>
                    <Typography color="text.secondary">
                        {todayCompletedCount}/{habits.length} completed today • {totalStreakDays} total streak days
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    New Habit
                </Button>
            </Box>

            {/* Week View */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        This Week
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        {weekDates.map((date) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const isToday = dateStr === today;
                            return (
                                <Box
                                    key={dateStr}
                                    sx={{
                                        textAlign: 'center',
                                        flex: 1,
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor: isToday ? 'primary.main' : 'transparent',
                                        color: isToday ? 'white' : 'text.primary',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {date.getDate()}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </CardContent>
            </Card>

            {habits.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <LocalFireDepartment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            No habits yet. Start building good habits!
                        </Typography>
                        <Button variant="outlined" onClick={() => setOpen(true)}>
                            Create Habit
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {habits.map((habit) => {
                        const isCompletedToday = habit.completedDates.includes(today);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={habit.id}>
                                <Card
                                    sx={{
                                        transition: 'all 0.3s ease',
                                        border: `2px solid ${isCompletedToday ? habit.color : 'transparent'}`,
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 30px ${habit.color}30`,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 24,
                                                        backgroundColor: `${habit.color}20`,
                                                    }}
                                                >
                                                    {habit.icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {habit.title}
                                                    </Typography>
                                                    {habit.description && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {habit.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteHabit(habit.id)}
                                                sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        {/* Week progress */}
                                        <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                                            {weekDates.map((date) => {
                                                const dateStr = date.toISOString().split('T')[0];
                                                const isCompleted = habit.completedDates.includes(dateStr);
                                                const isToday = dateStr === today;
                                                return (
                                                    <Tooltip
                                                        key={dateStr}
                                                        title={`${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}${isCompleted ? ' ✓' : ''}`}
                                                    >
                                                        <Box
                                                            onClick={() => toggleHabitDay(habit.id, dateStr)}
                                                            sx={{
                                                                flex: 1,
                                                                height: 8,
                                                                borderRadius: 1,
                                                                cursor: 'pointer',
                                                                backgroundColor: isCompleted ? habit.color : `${habit.color}20`,
                                                                border: isToday ? `2px solid ${habit.color}` : 'none',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    transform: 'scaleY(1.5)',
                                                                },
                                                            }}
                                                        />
                                                    </Tooltip>
                                                );
                                            })}
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocalFireDepartment sx={{ color: habit.streak > 0 ? '#f59e0b' : 'text.disabled', fontSize: 20 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {habit.streak} day streak
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant={isCompletedToday ? 'contained' : 'outlined'}
                                                size="small"
                                                onClick={() => toggleHabitDay(habit.id, today)}
                                                sx={{
                                                    backgroundColor: isCompletedToday ? habit.color : 'transparent',
                                                    borderColor: habit.color,
                                                    color: isCompletedToday ? 'white' : habit.color,
                                                    '&:hover': {
                                                        backgroundColor: isCompletedToday ? habit.color : `${habit.color}10`,
                                                    },
                                                }}
                                                startIcon={isCompletedToday ? <CheckCircle /> : null}
                                            >
                                                {isCompletedToday ? 'Done!' : 'Mark Done'}
                                            </Button>
                                        </Box>

                                        {habit.bestStreak > 0 && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                Best streak: {habit.bestStreak} days
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Add Habit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Habit</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Habit Name"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Description (optional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Frequency"
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Habit['frequency'] })}
                            fullWidth
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                        </TextField>
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Icon
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {habitIcons.map((icon) => (
                                    <Box
                                        key={icon}
                                        onClick={() => setFormData({ ...formData, icon })}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 20,
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            border: formData.icon === icon ? '2px solid' : '2px solid transparent',
                                            borderColor: formData.icon === icon ? 'primary.main' : 'transparent',
                                            backgroundColor: formData.icon === icon ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        {icon}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Color
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {habitColors.map((color) => (
                                    <Box
                                        key={color}
                                        onClick={() => setFormData({ ...formData, color })}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            cursor: 'pointer',
                                            border: formData.color === color ? '3px solid white' : '3px solid transparent',
                                            boxShadow: formData.color === color ? `0 0 0 2px ${color}` : 'none',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Create Habit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

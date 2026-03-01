import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    Slider,
    IconButton,
    LinearProgress,
} from '@mui/material';
import {
    FitnessCenter,
    LocalDrink,
    Bedtime,
    SentimentSatisfiedAlt,
    Add,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, getTodayDateString, moodEmojis } from '../utils/helpers';
import type { HealthEntry } from '../types';

const workoutTypes = ['Running', 'Gym', 'Yoga', 'Swimming', 'Cycling', 'Walking', 'HIIT', 'Other'];

export default function Health() {
    const { healthEntries, addHealthEntry, updateHealthEntry } = useStore();
    const today = getTodayDateString();

    const todayEntry = healthEntries.find((e) => e.date === today);

    const [water, setWater] = useState(todayEntry?.water || 0);
    const [sleep, setSleep] = useState(todayEntry?.sleep || 7);
    const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(todayEntry?.mood || 3);
    const [workoutOpen, setWorkoutOpen] = useState(false);
    const [workoutData, setWorkoutData] = useState({
        type: 'Running',
        duration: 30,
        calories: 200,
    });

    const updateOrCreateEntry = (updates: Partial<HealthEntry>) => {
        if (todayEntry) {
            updateHealthEntry(todayEntry.id, updates);
        } else {
            const entry: HealthEntry = {
                id: generateId(),
                date: today,
                water: 0,
                ...updates,
            };
            addHealthEntry(entry);
        }
    };

    const handleWaterChange = (glasses: number) => {
        setWater(glasses);
        updateOrCreateEntry({ water: glasses });
    };

    const handleSleepChange = (_: Event, value: number | number[]) => {
        const hours = value as number;
        setSleep(hours);
        updateOrCreateEntry({ sleep: hours });
    };

    const handleMoodChange = (newMood: 1 | 2 | 3 | 4 | 5) => {
        setMood(newMood);
        updateOrCreateEntry({ mood: newMood });
    };

    const handleAddWorkout = () => {
        updateOrCreateEntry({
            workout: {
                type: workoutData.type,
                duration: workoutData.duration,
                calories: workoutData.calories,
            },
        });
        setWorkoutOpen(false);
    };

    const weekStats = healthEntries.slice(-7);
    const avgWater = weekStats.length > 0 ? Math.round(weekStats.reduce((acc, e) => acc + e.water, 0) / weekStats.length) : 0;
    const avgSleep = weekStats.length > 0 ? (weekStats.reduce((acc, e) => acc + (e.sleep || 0), 0) / weekStats.length).toFixed(1) : 0;
    const workoutsThisWeek = weekStats.filter((e) => e.workout).length;

    return (
        <Box className="animate-fade-in">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Health & Fitness 🏋️
                </Typography>
                <Typography color="text.secondary">
                    Track your wellness journey
                </Typography>
            </Box>

            {/* Weekly Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                                Avg. Water (7 days)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                                {avgWater} glasses
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                                Avg. Sleep (7 days)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                                {avgSleep} hours
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                                Workouts (7 days)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>
                                {workoutsThisWeek} sessions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Today's Log
            </Typography>

            <Grid container spacing={3}>
                {/* Water Intake */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <LocalDrink sx={{ color: '#06b6d4', fontSize: 28 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Water Intake
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min((water / 8) * 100, 100)}
                                    sx={{
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 6,
                                            backgroundColor: '#06b6d4',
                                        },
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {water}/8 glasses (Goal: 8)
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                                    <IconButton
                                        key={glass}
                                        onClick={() => handleWaterChange(glass)}
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 2,
                                            backgroundColor: glass <= water ? '#06b6d4' : 'rgba(6, 182, 212, 0.1)',
                                            color: glass <= water ? 'white' : '#06b6d4',
                                            '&:hover': {
                                                backgroundColor: glass <= water ? '#0891b2' : 'rgba(6, 182, 212, 0.2)',
                                            },
                                        }}
                                    >
                                        <LocalDrink fontSize="small" />
                                    </IconButton>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sleep */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Bedtime sx={{ color: '#8b5cf6', fontSize: 28 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Sleep Hours
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 2 }}>
                                {sleep} hours
                            </Typography>
                            <Slider
                                value={sleep}
                                onChange={handleSleepChange}
                                min={0}
                                max={12}
                                step={0.5}
                                marks={[
                                    { value: 0, label: '0h' },
                                    { value: 6, label: '6h' },
                                    { value: 8, label: '8h' },
                                    { value: 12, label: '12h' },
                                ]}
                                sx={{
                                    color: '#8b5cf6',
                                    '& .MuiSlider-thumb': {
                                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Mood */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <SentimentSatisfiedAlt sx={{ color: '#f59e0b', fontSize: 28 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Today's Mood
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                {([1, 2, 3, 4, 5] as const).map((level) => (
                                    <Box
                                        key={level}
                                        onClick={() => handleMoodChange(level)}
                                        sx={{
                                            fontSize: 40,
                                            cursor: 'pointer',
                                            opacity: mood === level ? 1 : 0.4,
                                            transform: mood === level ? 'scale(1.2)' : 'scale(1)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                opacity: 1,
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        {moodEmojis[level]}
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Workout */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <FitnessCenter sx={{ color: '#22c55e', fontSize: 28 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Workout
                                    </Typography>
                                </Box>
                                {!todayEntry?.workout && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={() => setWorkoutOpen(true)}
                                        sx={{ backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}
                                    >
                                        Log Workout
                                    </Button>
                                )}
                            </Box>
                            {todayEntry?.workout ? (
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.2)',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {todayEntry.workout.type}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {todayEntry.workout.duration} minutes • {todayEntry.workout.calories} cal burned
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">No workout logged today</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Workout Dialog */}
            {workoutOpen && (
                <Card sx={{ mt: 3, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Log Workout
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Workout Type"
                                    value={workoutData.type}
                                    onChange={(e) => setWorkoutData({ ...workoutData, type: e.target.value })}
                                    fullWidth
                                    SelectProps={{ native: true }}
                                >
                                    {workoutTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Duration (minutes)"
                                    type="number"
                                    value={workoutData.duration}
                                    onChange={(e) => setWorkoutData({ ...workoutData, duration: parseInt(e.target.value) || 0 })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Calories Burned"
                                    type="number"
                                    value={workoutData.calories}
                                    onChange={(e) => setWorkoutData({ ...workoutData, calories: parseInt(e.target.value) || 0 })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button onClick={() => setWorkoutOpen(false)}>Cancel</Button>
                                    <Button variant="contained" onClick={handleAddWorkout}>
                                        Save Workout
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

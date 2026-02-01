import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Chip,
    Grid,
    Menu,
    MenuItem,
    Collapse,
} from '@mui/material';
import {
    Add,
    MoreVert,
    Flag,
    CheckCircle,
    ExpandMore,
    ExpandLess,
    Delete,
    Edit,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, formatDate, categoryColors } from '../utils/helpers';
import type { Goal } from '../types';

const categories = ['career', 'health', 'finance', 'personal', 'learning', 'relationships'] as const;

export default function Goals() {
    const { goals, addGoal, updateGoal, deleteGoal, addXP } = useStore();
    const [open, setOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'personal' as Goal['category'],
        deadline: '',
        milestones: [] as { id: string; title: string; completed: boolean }[],
    });
    const [newMilestone, setNewMilestone] = useState('');

    const handleOpen = (goal?: Goal) => {
        if (goal) {
            setEditingGoal(goal);
            setFormData({
                title: goal.title,
                description: goal.description,
                category: goal.category,
                deadline: goal.deadline || '',
                milestones: goal.milestones,
            });
        } else {
            setEditingGoal(null);
            setFormData({
                title: '',
                description: '',
                category: 'personal',
                deadline: '',
                milestones: [],
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingGoal(null);
        setNewMilestone('');
    };

    const handleAddMilestone = () => {
        if (newMilestone.trim()) {
            setFormData({
                ...formData,
                milestones: [
                    ...formData.milestones,
                    { id: generateId(), title: newMilestone.trim(), completed: false },
                ],
            });
            setNewMilestone('');
        }
    };

    const handleRemoveMilestone = (id: string) => {
        setFormData({
            ...formData,
            milestones: formData.milestones.filter((m) => m.id !== id),
        });
    };

    const handleSave = () => {
        if (!formData.title.trim()) return;

        const progress = formData.milestones.length > 0
            ? Math.round(
                (formData.milestones.filter((m) => m.completed).length / formData.milestones.length) * 100
            )
            : 0;

        if (editingGoal) {
            updateGoal(editingGoal.id, {
                ...formData,
                progress,
            });
        } else {
            const goal: Goal = {
                id: generateId(),
                ...formData,
                progress,
                createdAt: new Date().toISOString(),
            };
            addGoal(goal);
        }
        handleClose();
    };

    const toggleMilestone = (goalId: string, milestoneId: string) => {
        const goal = goals.find((g) => g.id === goalId);
        if (!goal) return;

        const updatedMilestones = goal.milestones.map((m) =>
            m.id === milestoneId
                ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
                : m
        );

        const progress = Math.round(
            (updatedMilestones.filter((m) => m.completed).length / updatedMilestones.length) * 100
        );

        const isCompleted = progress === 100;

        updateGoal(goalId, {
            milestones: updatedMilestones,
            progress,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
        });

        if (isCompleted && !goal.completedAt) {
            addXP(100);
        }
    };

    const toggleExpand = (goalId: string) => {
        const newExpanded = new Set(expandedGoals);
        if (newExpanded.has(goalId)) {
            newExpanded.delete(goalId);
        } else {
            newExpanded.add(goalId);
        }
        setExpandedGoals(newExpanded);
    };

    const activeGoals = goals.filter((g) => !g.completedAt);
    const completedGoals = goals.filter((g) => g.completedAt);

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Goals 🎯
                    </Typography>
                    <Typography color="text.secondary">
                        Set your vision and track your progress
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    New Goal
                </Button>
            </Box>

            {/* Active Goals */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Active Goals ({activeGoals.length})
            </Typography>

            {activeGoals.length === 0 ? (
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Flag sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            No active goals yet. Set your first goal!
                        </Typography>
                        <Button variant="outlined" onClick={() => handleOpen()}>
                            Create Goal
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {activeGoals.map((goal) => (
                        <Grid item xs={12} md={6} key={goal.id}>
                            <Card className="card-hover">
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Chip
                                                    label={goal.category}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${categoryColors[goal.category]}20`,
                                                        color: categoryColors[goal.category],
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                                {goal.deadline && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Due: {formatDate(goal.deadline)}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {goal.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {goal.description}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setAnchorEl(e.currentTarget);
                                                setSelectedGoalId(goal.id);
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Progress
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                {goal.progress}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={goal.progress}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 5,
                                                    background: 'linear-gradient(90deg, #0ea5e9 0%, #8b5cf6 100%)',
                                                },
                                            }}
                                        />
                                    </Box>

                                    {goal.milestones.length > 0 && (
                                        <>
                                            <Button
                                                size="small"
                                                onClick={() => toggleExpand(goal.id)}
                                                endIcon={expandedGoals.has(goal.id) ? <ExpandLess /> : <ExpandMore />}
                                                sx={{ mb: 1 }}
                                            >
                                                {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} Milestones
                                            </Button>
                                            <Collapse in={expandedGoals.has(goal.id)}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    {goal.milestones.map((milestone) => (
                                                        <Box
                                                            key={milestone.id}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                p: 1.5,
                                                                borderRadius: 1,
                                                                backgroundColor: milestone.completed
                                                                    ? 'rgba(34, 197, 94, 0.1)'
                                                                    : 'rgba(255, 255, 255, 0.03)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    backgroundColor: milestone.completed
                                                                        ? 'rgba(34, 197, 94, 0.15)'
                                                                        : 'rgba(255, 255, 255, 0.05)',
                                                                },
                                                            }}
                                                            onClick={() => toggleMilestone(goal.id, milestone.id)}
                                                        >
                                                            <CheckCircle
                                                                sx={{
                                                                    color: milestone.completed ? 'success.main' : 'text.disabled',
                                                                }}
                                                            />
                                                            <Typography
                                                                sx={{
                                                                    textDecoration: milestone.completed ? 'line-through' : 'none',
                                                                    color: milestone.completed ? 'text.secondary' : 'text.primary',
                                                                }}
                                                            >
                                                                {milestone.title}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Collapse>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Completed Goals ({completedGoals.length}) 🎉
                    </Typography>
                    <Grid container spacing={3}>
                        {completedGoals.map((goal) => (
                            <Grid item xs={12} md={6} key={goal.id}>
                                <Card sx={{ opacity: 0.7 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CheckCircle sx={{ color: 'success.main' }} />
                                            <Box>
                                                <Typography sx={{ fontWeight: 600 }}>{goal.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Completed on {formatDate(goal.completedAt!)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={() => {
                        const goal = goals.find((g) => g.id === selectedGoalId);
                        if (goal) handleOpen(goal);
                        setAnchorEl(null);
                    }}
                >
                    <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (selectedGoalId) deleteGoal(selectedGoalId);
                        setAnchorEl(null);
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
                </MenuItem>
            </Menu>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Goal Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal['category'] })}
                            fullWidth
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: categoryColors[cat],
                                            }}
                                        />
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        {/* Milestones */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Milestones
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <TextField
                                    size="small"
                                    placeholder="Add milestone..."
                                    value={newMilestone}
                                    onChange={(e) => setNewMilestone(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddMilestone()}
                                    fullWidth
                                />
                                <Button onClick={handleAddMilestone} variant="outlined">
                                    Add
                                </Button>
                            </Box>
                            {formData.milestones.map((m) => (
                                <Chip
                                    key={m.id}
                                    label={m.title}
                                    onDelete={() => handleRemoveMilestone(m.id)}
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingGoal ? 'Save Changes' : 'Create Goal'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

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
    Chip,
    Checkbox,
    MenuItem,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add,
    Delete,
    CheckCircle,
    RadioButtonUnchecked,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, formatDate, priorityColors } from '../utils/helpers';
import type { Task } from '../types';

const priorities = ['urgent', 'high', 'medium', 'low'] as const;

export default function Tasks() {
    const { tasks, addTask, toggleTask, deleteTask } = useStore();
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as Task['priority'],
        category: '',
        dueDate: '',
    });

    const handleSave = () => {
        if (!formData.title.trim()) return;

        const task: Task = {
            id: generateId(),
            ...formData,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        addTask(task);
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            category: '',
            dueDate: '',
        });
        setOpen(false);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const pendingCount = tasks.filter((t) => !t.completed).length;
    const completedCount = tasks.filter((t) => t.completed).length;

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Tasks ✅
                    </Typography>
                    <Typography color="text.secondary">
                        {pendingCount} pending • {completedCount} completed
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Task
                </Button>
            </Box>

            <Tabs
                value={filter}
                onChange={(_, v) => setFilter(v)}
                sx={{ mb: 3 }}
            >
                <Tab label={`All (${tasks.length})`} value="all" />
                <Tab label={`Pending (${pendingCount})`} value="pending" />
                <Tab label={`Completed (${completedCount})`} value="completed" />
            </Tabs>

            {sortedTasks.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <CheckCircle sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            {filter === 'completed'
                                ? 'No completed tasks yet'
                                : filter === 'pending'
                                    ? "All caught up! 🎉"
                                    : 'No tasks yet. Add your first task!'}
                        </Typography>
                        {filter !== 'completed' && (
                            <Button variant="outlined" onClick={() => setOpen(true)}>
                                Add Task
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sortedTasks.map((task) => (
                        <Card
                            key={task.id}
                            sx={{
                                opacity: task.completed ? 0.6 : 1,
                                borderLeft: `4px solid ${priorityColors[task.priority]}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateX(4px)',
                                },
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Checkbox
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        icon={<RadioButtonUnchecked />}
                                        checkedIcon={<CheckCircle sx={{ color: 'success.main' }} />}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                            }}
                                        >
                                            {task.title}
                                        </Typography>
                                        {task.description && (
                                            <Typography variant="body2" color="text.secondary">
                                                {task.description}
                                            </Typography>
                                        )}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={task.priority}
                                                size="small"
                                                sx={{
                                                    backgroundColor: `${priorityColors[task.priority]}20`,
                                                    color: priorityColors[task.priority],
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                }}
                                            />
                                            {task.category && (
                                                <Chip label={task.category} size="small" variant="outlined" />
                                            )}
                                            {task.dueDate && (
                                                <Chip
                                                    label={`Due: ${formatDate(task.dueDate)}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    <IconButton
                                        onClick={() => deleteTask(task.id)}
                                        sx={{ color: 'error.main', opacity: 0.7, '&:hover': { opacity: 1 } }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Add Task Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Task Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Description (optional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={2}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                            fullWidth
                        >
                            {priorities.map((p) => (
                                <MenuItem key={p} value={p}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: priorityColors[p],
                                            }}
                                        />
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Category (optional)"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

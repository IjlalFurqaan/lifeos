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
    LinearProgress,
    Chip,
} from '@mui/material';
import {
    Add,
    Delete,
    School,
    MenuBook,
    Code,
    Build,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, formatDate } from '../utils/helpers';
import type { LearningItem } from '../types';

const typeIcons: Record<string, React.ReactNode> = {
    course: <School />,
    book: <MenuBook />,
    skill: <Code />,
    project: <Build />,
};

const typeColors: Record<string, string> = {
    course: '#8b5cf6',
    book: '#f59e0b',
    skill: '#0ea5e9',
    project: '#22c55e',
};

export default function Learning() {
    const { learningItems, addLearningItem, updateLearningItem, deleteLearningItem } = useStore();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'course' as LearningItem['type'],
        category: '',
        notes: '',
    });

    const handleSave = () => {
        if (!formData.title.trim()) return;

        const item: LearningItem = {
            id: generateId(),
            ...formData,
            progress: 0,
            startedAt: new Date().toISOString(),
        };
        addLearningItem(item);
        setFormData({ title: '', type: 'course', category: '', notes: '' });
        setOpen(false);
    };

    const handleProgressChange = (id: string, progress: number) => {
        updateLearningItem(id, {
            progress,
            completedAt: progress === 100 ? new Date().toISOString() : undefined,
        });
    };

    const inProgress = learningItems.filter((item) => !item.completedAt);
    const completed = learningItems.filter((item) => item.completedAt);

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Learning 📚
                    </Typography>
                    <Typography color="text.secondary">
                        Track your learning journey
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Item
                </Button>
            </Box>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {(['course', 'book', 'skill', 'project'] as const).map((type) => {
                    const count = learningItems.filter((i) => i.type === type).length;
                    const completedCount = learningItems.filter((i) => i.type === type && i.completedAt).length;
                    return (
                        <Grid item xs={6} sm={3} key={type}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ color: typeColors[type], mb: 1 }}>
                                        {typeIcons[type]}
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        {count}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}s ({completedCount} done)
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* In Progress */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                In Progress ({inProgress.length})
            </Typography>

            {inProgress.length === 0 ? (
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Nothing in progress. Start learning something new!
                        </Typography>
                        <Button variant="outlined" onClick={() => setOpen(true)}>
                            Add Learning Item
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {inProgress.map((item) => (
                        <Grid item xs={12} md={6} key={item.id}>
                            <Card className="card-hover">
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: `${typeColors[item.type]}20`,
                                                    color: typeColors[item.type],
                                                }}
                                            >
                                                {typeIcons[item.type]}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {item.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                    <Chip
                                                        label={item.type}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${typeColors[item.type]}20`,
                                                            color: typeColors[item.type],
                                                            textTransform: 'capitalize',
                                                        }}
                                                    />
                                                    {item.category && (
                                                        <Chip label={item.category} size="small" variant="outlined" />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteLearningItem(item.id)}
                                            sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Progress
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: typeColors[item.type] }}>
                                                {item.progress}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.progress}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: `${typeColors[item.type]}20`,
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    backgroundColor: typeColors[item.type],
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {[0, 25, 50, 75, 100].map((progress) => (
                                            <Button
                                                key={progress}
                                                size="small"
                                                variant={item.progress === progress ? 'contained' : 'outlined'}
                                                onClick={() => handleProgressChange(item.id, progress)}
                                                sx={{
                                                    minWidth: 45,
                                                    backgroundColor: item.progress === progress ? typeColors[item.type] : 'transparent',
                                                    borderColor: typeColors[item.type],
                                                    color: item.progress === progress ? 'white' : typeColors[item.type],
                                                    '&:hover': {
                                                        backgroundColor: item.progress === progress ? typeColors[item.type] : `${typeColors[item.type]}10`,
                                                    },
                                                }}
                                            >
                                                {progress}%
                                            </Button>
                                        ))}
                                    </Box>

                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                        Started: {formatDate(item.startedAt)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Completed */}
            {completed.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Completed ({completed.length}) 🎓
                    </Typography>
                    <Grid container spacing={2}>
                        {completed.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card sx={{ opacity: 0.8 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ color: typeColors[item.type] }}>
                                                {typeIcons[item.type]}
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Completed {formatDate(item.completedAt!)}
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

            {/* Add Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Learning Item</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            select
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as LearningItem['type'] })}
                            fullWidth
                        >
                            <MenuItem value="course">Course</MenuItem>
                            <MenuItem value="book">Book</MenuItem>
                            <MenuItem value="skill">Skill</MenuItem>
                            <MenuItem value="project">Project</MenuItem>
                        </TextField>
                        <TextField
                            label="Category (optional)"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            fullWidth
                            placeholder="e.g., Programming, Design, Business"
                        />
                        <TextField
                            label="Notes (optional)"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

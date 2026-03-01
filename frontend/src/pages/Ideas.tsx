import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    IconButton,
    Grid,
    Chip,
    InputAdornment,
} from '@mui/material';
import {
    Add,
    Delete,
    Lightbulb,
    Search,
    PushPin,
    PushPinOutlined,
} from '@mui/icons-material';
import { useStore } from '../store';
import { generateId, formatRelativeTime } from '../utils/helpers';
import type { Idea } from '../types';

export default function Ideas() {
    const { ideas, addIdea, updateIdea, deleteIdea } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        tags: [] as string[],
    });
    const [tagInput, setTagInput] = useState('');

    const handleSave = () => {
        if (!formData.title.trim()) return;

        const idea: Idea = {
            id: generateId(),
            ...formData,
            pinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addIdea(idea);
        setFormData({ title: '', content: '', category: '', tags: [] });
        setShowForm(false);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    };

    const togglePin = (id: string) => {
        const idea = ideas.find((i) => i.id === id);
        if (idea) {
            updateIdea(id, { pinned: !idea.pinned });
        }
    };

    const filteredIdeas = ideas.filter((idea) => {
        const query = searchQuery.toLowerCase();
        return (
            idea.title.toLowerCase().includes(query) ||
            idea.content.toLowerCase().includes(query) ||
            idea.tags.some((tag) => tag.toLowerCase().includes(query)) ||
            (idea.category && idea.category.toLowerCase().includes(query))
        );
    });

    const sortedIdeas = [...filteredIdeas].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Ideas 💡
                    </Typography>
                    <Typography color="text.secondary">
                        Capture and organize your thoughts
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(true)}>
                    New Idea
                </Button>
            </Box>

            {/* Search */}
            <TextField
                fullWidth
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />

            {/* New Idea Form */}
            {showForm && (
                <Card sx={{ mb: 3, border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Capture New Idea
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                fullWidth
                                autoFocus
                            />
                            <TextField
                                label="Content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                multiline
                                rows={4}
                                fullWidth
                            />
                            <TextField
                                label="Category (optional)"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                fullWidth
                                placeholder="e.g., Business, Personal, Tech"
                            />
                            <Box>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Add tag..."
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                    />
                                    <Button onClick={handleAddTag} variant="outlined" size="small">
                                        Add
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {formData.tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => handleRemoveTag(tag)}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button onClick={handleSave} variant="contained">
                                    Save Idea
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Ideas Grid */}
            {sortedIdeas.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Lightbulb sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            {searchQuery ? 'No ideas match your search' : 'No ideas captured yet'}
                        </Typography>
                        {!searchQuery && (
                            <Button variant="outlined" onClick={() => setShowForm(true)}>
                                Capture First Idea
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {sortedIdeas.map((idea) => (
                        <Grid item xs={12} sm={6} md={4} key={idea.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    border: idea.pinned ? '1px solid rgba(245, 158, 11, 0.3)' : 'none',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                                            {idea.title}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => togglePin(idea.id)}
                                                sx={{ color: idea.pinned ? 'warning.main' : 'text.secondary' }}
                                            >
                                                {idea.pinned ? <PushPin /> : <PushPinOutlined />}
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteIdea(idea.id)}
                                                sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {idea.content}
                                    </Typography>

                                    {(idea.category || idea.tags.length > 0) && (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                            {idea.category && (
                                                <Chip
                                                    label={idea.category}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                                        color: 'primary.main',
                                                    }}
                                                />
                                            )}
                                            {idea.tags.map((tag) => (
                                                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    )}

                                    <Typography variant="caption" color="text.secondary">
                                        {formatRelativeTime(idea.createdAt)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

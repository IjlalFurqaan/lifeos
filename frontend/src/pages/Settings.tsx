import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Alert,
    Grid,
    Avatar,
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    Key,
    Person,
    Refresh,
} from '@mui/icons-material';
import { useStore } from '../store';
import { initGemini, isGeminiInitialized } from '../services/gemini';

export default function Settings() {
    const { user, updateUser, settings, updateSettings } = useStore();
    const [name, setName] = useState(user.name);
    const [apiKey, setApiKey] = useState(settings.geminiApiKey);
    const [showApiKey, setShowApiKey] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSaveName = () => {
        updateUser({ name });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSaveApiKey = () => {
        updateSettings({ geminiApiKey: apiKey });
        if (apiKey) {
            initGemini(apiKey);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleTheme = () => {
        updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
    };

    const handleResetData = () => {
        if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <Box className="animate-fade-in">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Settings ⚙️
                </Typography>
                <Typography color="text.secondary">
                    Customize your LifeOS experience
                </Typography>
            </Box>

            {saved && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Settings saved successfully!
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Profile Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Person sx={{ color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Profile
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        fontSize: 32,
                                        background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                                    }}
                                >
                                    {name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{name}</Typography>
                                    <Typography color="text.secondary">
                                        Level {user.level} • {user.xp} XP
                                    </Typography>
                                </Box>
                            </Box>

                            <TextField
                                label="Display Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" onClick={handleSaveName}>
                                Save Name
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Appearance */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                {settings.theme === 'dark' ? (
                                    <DarkMode sx={{ color: 'primary.main' }} />
                                ) : (
                                    <LightMode sx={{ color: 'warning.main' }} />
                                )}
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Appearance
                                </Typography>
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.theme === 'dark'}
                                        onChange={toggleTheme}
                                    />
                                }
                                label="Dark Mode"
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Switch between dark and light themes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* AI Integration */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Key sx={{ color: 'secondary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    AI Integration (Gemini)
                                </Typography>
                            </Box>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Add your Gemini API key to enable AI-powered features like daily summaries,
                                task suggestions, and motivational quotes.
                            </Alert>

                            <TextField
                                label="Gemini API Key"
                                type={showApiKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="Enter your Gemini API key"
                            />

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Button variant="contained" onClick={handleSaveApiKey}>
                                    Save API Key
                                </Button>
                                <Button variant="outlined" onClick={() => setShowApiKey(!showApiKey)}>
                                    {showApiKey ? 'Hide' : 'Show'} Key
                                </Button>
                                {isGeminiInitialized() && (
                                    <Typography variant="body2" color="success.main">
                                        ✓ API Connected
                                    </Typography>
                                )}
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Get your API key from{' '}
                                <a
                                    href="https://makersuite.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0ea5e9]"
                                >
                                    Google AI Studio
                                </a>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Data Management */}
                <Grid item xs={12}>
                    <Card sx={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Refresh sx={{ color: 'error.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                                    Data Management
                                </Typography>
                            </Box>

                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                All your data is stored locally in your browser. You can reset all data
                                to start fresh, but this action cannot be undone.
                            </Typography>

                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleResetData}
                            >
                                Reset All Data
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

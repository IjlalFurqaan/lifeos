import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Finance from './pages/Finance';
import Health from './pages/Health';
import Learning from './pages/Learning';
import Ideas from './pages/Ideas';
import Focus from './pages/Focus';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

function App() {
    const { settings } = useStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const theme = useMemo(() => {
        return settings.theme === 'dark' ? darkTheme : lightTheme;
    }, [settings.theme]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes - wrapped in layout */}
                    <Route
                        path="/*"
                        element={
                            <>
                                {/* Stars Background */}
                                <div className="stars-container" />
                                <div className="glow-effect" />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        minHeight: '100vh',
                                        backgroundColor: 'transparent',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                                    <Box
                                        component="main"
                                        className="main-content"
                                        sx={{
                                            flexGrow: 1,
                                            p: 4,
                                            ml: sidebarOpen ? '280px' : '80px',
                                            transition: 'margin-left 0.3s ease',
                                            minHeight: '100vh',
                                            maxWidth: '1400px',
                                        }}
                                    >
                                        <Routes>
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/goals" element={<Goals />} />
                                            <Route path="/tasks" element={<Tasks />} />
                                            <Route path="/habits" element={<Habits />} />
                                            <Route path="/finance" element={<Finance />} />
                                            <Route path="/health" element={<Health />} />
                                            <Route path="/learning" element={<Learning />} />
                                            <Route path="/ideas" element={<Ideas />} />
                                            <Route path="/focus" element={<Focus />} />
                                            <Route path="/analytics" element={<Analytics />} />
                                            <Route path="/settings" element={<Settings />} />
                                        </Routes>
                                    </Box>
                                </Box>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;

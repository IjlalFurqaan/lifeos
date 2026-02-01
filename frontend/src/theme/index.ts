import { createTheme } from '@mui/material/styles';

const darkPalette = {
    primary: {
        main: '#ff6b6b',
        light: '#ff8585',
        dark: '#e55a5a',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#4ecdc4',
        light: '#6ee7de',
        dark: '#3db8b0',
        contrastText: '#ffffff',
    },
    error: {
        main: '#ff5252',
        light: '#ff7b7b',
        dark: '#d32f2f',
    },
    warning: {
        main: '#ffc107',
        light: '#ffd54f',
        dark: '#ff8f00',
    },
    success: {
        main: '#4ecdc4',
        light: '#6ee7de',
        dark: '#3db8b0',
    },
    background: {
        default: '#0a0a0f',
        paper: '#16161f',
    },
    text: {
        primary: '#ffffff',
        secondary: '#8b8b9a',
        disabled: '#5a5a6a',
    },
    divider: 'rgba(255, 255, 255, 0.05)',
};

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        ...darkPalette,
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
        },
        h2: {
            fontSize: '2.25rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
        },
        h3: {
            fontSize: '1.875rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0a0a0f',
                    backgroundImage: 'radial-gradient(ellipse at top, rgba(255, 107, 107, 0.03) 0%, transparent 50%)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(22, 22, 31, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        borderColor: 'rgba(255, 107, 107, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '10px 24px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                },
                contained: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #e55a5a 100%)',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                        background: 'linear-gradient(135deg, #ff7b7b 0%, #ff6b6b 100%)',
                    },
                },
                outlined: {
                    borderColor: 'rgba(255, 107, 107, 0.5)',
                    color: '#ff6b6b',
                    '&:hover': {
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.08)',
                    },
                },
                text: {
                    color: '#8b8b9a',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.08)',
                        color: '#ff6b6b',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        color: '#ff6b6b',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(18, 18, 26, 0.8)',
                        borderRadius: '12px',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 107, 107, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ff6b6b',
                            borderWidth: '1px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#8b8b9a',
                        '&.Mui-focused': {
                            color: '#ff6b6b',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    fontWeight: 500,
                },
                filled: {
                    backgroundColor: 'rgba(255, 107, 107, 0.15)',
                    color: '#ff6b6b',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.25)',
                    },
                },
                outlined: {
                    borderColor: 'rgba(255, 107, 107, 0.3)',
                    color: '#ff6b6b',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    height: '6px',
                },
                bar: {
                    background: 'linear-gradient(90deg, #ff6b6b, #ff8585)',
                    borderRadius: '6px',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: '#16161f',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    margin: '2px 8px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 107, 107, 0.15)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                        },
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#8b8b9a',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 107, 107, 0.15)',
                        color: '#ff6b6b',
                        borderColor: 'rgba(255, 107, 107, 0.3)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.2)',
                        },
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1a1a28',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    padding: '8px 12px',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                    fontWeight: 700,
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ff6b6b',
                        '& + .MuiSwitch-track': {
                            backgroundColor: '#ff6b6b',
                        },
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                },
                standardSuccess: {
                    backgroundColor: 'rgba(78, 205, 196, 0.15)',
                    color: '#4ecdc4',
                },
                standardInfo: {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    color: '#ff8585',
                },
                standardWarning: {
                    backgroundColor: 'rgba(255, 193, 7, 0.15)',
                    color: '#ffc107',
                },
                standardError: {
                    backgroundColor: 'rgba(255, 82, 82, 0.15)',
                    color: '#ff5252',
                },
            },
        },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ff6b6b',
            light: '#ff8585',
            dark: '#e55a5a',
        },
        secondary: {
            main: '#4ecdc4',
            light: '#6ee7de',
            dark: '#3db8b0',
        },
        background: {
            default: '#f8f9fc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a2e',
            secondary: '#666680',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '16px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
                contained: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #e55a5a 100%)',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.25)',
                },
            },
        },
    },
});

export default darkTheme;

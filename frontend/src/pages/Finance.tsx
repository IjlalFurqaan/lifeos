import { useState, useMemo } from 'react';
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
    Chip,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import {
    Add,
    Delete,
    TrendingUp,
    TrendingDown,
    AccountBalance,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useStore } from '../store';
import { generateId, formatCurrency, categoryColors } from '../utils/helpers';
import type { Transaction } from '../types';

const expenseCategories = ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'other'];
const incomeCategories = ['salary', 'freelance', 'investment', 'gift', 'other'];

export default function Finance() {
    const { transactions, addTransaction, deleteTransaction } = useStore();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<'overview' | 'transactions'>('overview');
    const [formData, setFormData] = useState({
        type: 'expense' as Transaction['type'],
        amount: '',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSave = () => {
        if (!formData.amount || !formData.description) return;

        const transaction: Transaction = {
            id: generateId(),
            type: formData.type,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            date: formData.date,
            createdAt: new Date().toISOString(),
        };
        addTransaction(transaction);
        setFormData({
            type: 'expense',
            amount: '',
            category: 'food',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });
        setOpen(false);
    };

    const stats = useMemo(() => {
        const thisMonth = new Date().toISOString().slice(0, 7);
        const monthTransactions = transactions.filter((t) => t.date.startsWith(thisMonth));

        const income = monthTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = monthTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const balance = income - expenses;

        const expensesByCategory = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
            name,
            value,
            color: categoryColors[name] || '#94a3b8',
        }));

        return { income, expenses, balance, pieData };
    }, [transactions]);

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <Box className="animate-fade-in">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Finance 💰
                    </Typography>
                    <Typography color="text.secondary">
                        Track your income and expenses
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Transaction
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Income
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                                        {formatCurrency(stats.income)}
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: 'success.main', opacity: 0.5 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Expenses
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                                        {formatCurrency(stats.expenses)}
                                    </Typography>
                                </Box>
                                <TrendingDown sx={{ fontSize: 40, color: 'error.main', opacity: 0.5 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ background: `linear-gradient(135deg, rgba(${stats.balance >= 0 ? '14, 165, 233' : '239, 68, 68'}, 0.1) 0%, rgba(${stats.balance >= 0 ? '14, 165, 233' : '239, 68, 68'}, 0.05) 100%)` }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Balance
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: stats.balance >= 0 ? 'primary.main' : 'error.main' }}>
                                        {formatCurrency(stats.balance)}
                                    </Typography>
                                </Box>
                                <AccountBalance sx={{ fontSize: 40, color: 'primary.main', opacity: 0.5 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(_, v) => v && setView(v)}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="overview">Overview</ToggleButton>
                <ToggleButton value="transactions">Transactions</ToggleButton>
            </ToggleButtonGroup>

            {view === 'overview' ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Expenses by Category
                                </Typography>
                                {stats.pieData.length > 0 ? (
                                    <Box sx={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.pieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {stats.pieData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value: number) => formatCurrency(value)}
                                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 6 }}>
                                        <Typography color="text.secondary">No expense data yet</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Recent Transactions
                                </Typography>
                                {sortedTransactions.slice(0, 5).map((t) => (
                                    <Box
                                        key={t.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            py: 1.5,
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                        }}
                                    >
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>{t.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {t.category}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                color: t.type === 'income' ? 'success.main' : 'error.main',
                                            }}
                                        >
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Card>
                    <CardContent>
                        {sortedTransactions.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <AccountBalance sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography color="text.secondary">No transactions yet</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {sortedTransactions.map((t) => (
                                    <Box
                                        key={t.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: t.type === 'income' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            }}
                                        >
                                            {t.type === 'income' ? (
                                                <TrendingUp sx={{ color: 'success.main' }} />
                                            ) : (
                                                <TrendingDown sx={{ color: 'error.main' }} />
                                            )}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontWeight: 500 }}>{t.description}</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                <Chip label={t.category} size="small" variant="outlined" />
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(t.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: t.type === 'income' ? 'success.main' : 'error.main',
                                            }}
                                        >
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => deleteTransaction(t.id)}
                                            sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Add Transaction Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <ToggleButtonGroup
                            value={formData.type}
                            exclusive
                            onChange={(_, v) => v && setFormData({ ...formData, type: v, category: v === 'income' ? 'salary' : 'food' })}
                            fullWidth
                        >
                            <ToggleButton value="expense" sx={{ flex: 1 }}>Expense</ToggleButton>
                            <ToggleButton value="income" sx={{ flex: 1 }}>Income</ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            label="Amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            fullWidth
                            InputProps={{ startAdornment: '$' }}
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            fullWidth
                        >
                            {(formData.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Add Transaction
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

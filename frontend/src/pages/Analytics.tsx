import { useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { useStore } from '../store';
import { formatCurrency, categoryColors } from '../utils/helpers';

export default function Analytics() {
    const { tasks, habits, focusSessions, transactions, goals, healthEntries } = useStore();

    const stats = useMemo(() => {
        // Tasks completed over last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const tasksByDay = last7Days.map((day) => ({
            day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
            completed: tasks.filter((t) => t.completedAt?.startsWith(day)).length,
        }));

        // Habits completion rate
        const habitCompletionRate = habits.length > 0
            ? Math.round(
                (habits.reduce((acc, h) => acc + (h.completedDates.length > 0 ? 1 : 0), 0) / habits.length) * 100
            )
            : 0;

        // Focus time by day
        const focusByDay = last7Days.map((day) => ({
            day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
            minutes: focusSessions
                .filter((s) => s.completedAt.startsWith(day))
                .reduce((acc, s) => acc + s.duration, 0),
        }));

        // Financial summary this month
        const thisMonth = new Date().toISOString().slice(0, 7);
        const monthTransactions = transactions.filter((t) => t.date.startsWith(thisMonth));
        const income = monthTransactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = monthTransactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

        // Expense breakdown
        const expensesByCategory = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        const expensePieData = Object.entries(expensesByCategory).map(([name, value]) => ({
            name,
            value,
            color: categoryColors[name] || '#94a3b8',
        }));

        // Goals progress
        const goalsInProgress = goals.filter((g) => !g.completedAt).length;
        const goalsCompleted = goals.filter((g) => g.completedAt).length;
        const avgGoalProgress = goals.length > 0
            ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
            : 0;

        // Health trends
        const recentHealth = healthEntries.slice(-7);
        const avgWater = recentHealth.length > 0
            ? Math.round(recentHealth.reduce((acc, e) => acc + e.water, 0) / recentHealth.length)
            : 0;
        const avgSleep = recentHealth.length > 0
            ? (recentHealth.reduce((acc, e) => acc + (e.sleep || 0), 0) / recentHealth.length).toFixed(1)
            : '0';

        return {
            tasksByDay,
            habitCompletionRate,
            focusByDay,
            income,
            expenses,
            expensePieData,
            goalsInProgress,
            goalsCompleted,
            avgGoalProgress,
            avgWater,
            avgSleep,
            totalTasks: tasks.length,
            completedTasks: tasks.filter((t) => t.completed).length,
            totalFocusMinutes: focusSessions.reduce((acc, s) => acc + s.duration, 0),
        };
    }, [tasks, habits, focusSessions, transactions, goals, healthEntries]);

    return (
        <Box className="animate-fade-in">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Analytics 📊
                </Typography>
                <Typography color="text.secondary">
                    Your life at a glance
                </Typography>
            </Box>

            {/* Overview Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Tasks Done
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {stats.completedTasks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                of {stats.totalTasks}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Focus Time
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                {Math.round(stats.totalFocusMinutes / 60)}h
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                total focused
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Goals Done
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                                {stats.goalsCompleted}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {stats.goalsInProgress} in progress
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                Avg Goal Progress
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                                {stats.avgGoalProgress}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                across all goals
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Tasks Trend */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Tasks Completed (Last 7 Days)
                            </Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.tasksByDay}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="day" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
                                        />
                                        <Bar dataKey="completed" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Focus Time Trend */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Focus Time (Last 7 Days)
                            </Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.focusByDay}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="day" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
                                            formatter={(value: number) => [`${value} min`, 'Focus Time']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="minutes"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Financial Overview */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Monthly Finances
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                        }}
                                    >
                                        <Typography color="text.secondary" variant="caption">
                                            Income
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                                            {formatCurrency(stats.income)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        }}
                                    >
                                        <Typography color="text.secondary" variant="caption">
                                            Expenses
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                                            {formatCurrency(stats.expenses)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            {stats.expensePieData.length > 0 && (
                                <Box sx={{ height: 200 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.expensePieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                            >
                                                {stats.expensePieData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }}
                                                formatter={(value: number) => formatCurrency(value)}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Health Summary */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Health Summary (7-Day Avg)
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 40, mb: 1 }}>💧</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                                            {stats.avgWater}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            glasses/day
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 40, mb: 1 }}>😴</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                                            {stats.avgSleep}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">
                                            hours/night
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography color="text.secondary" variant="body2">
                                            Habit Completion Rate
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                                            {stats.habitCompletionRate}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

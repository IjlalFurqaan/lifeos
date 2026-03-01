import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const habitSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    icon: z.string().default('⭐'),
    color: z.string().default('#ff6b6b'),
    frequency: z.enum(['daily', 'weekly']).default('daily'),
});

// Get all habits
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const habits = await prisma.habit.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'asc' },
    });
    res.json(habits);
}));

// Create habit
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = habitSchema.parse(req.body);

    const habit = await prisma.habit.create({
        data: { ...data, userId: req.user!.id },
    });

    res.status(201).json(habit);
}));

// Helper to calculate streak
const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    // Sort dates descending
    const sortedDates = [...completedDates].sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
    );

    // Get today and yesterday in YYYY-MM-DD format
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if the most recent completion is today or yesterday
    // If not, the streak is broken (unless we want to allow gaps, but for now strict)
    if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
        return 0;
    }

    let streak = 1;
    let currentDate = new Date(sortedDates[0]);

    // Iterate through past dates
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i]);
        
        // Expected previous date is 1 day before current
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];

        if (sortedDates[i] === expectedDateStr) {
            streak++;
            currentDate = prevDate;
        } else {
            // Gap found, stop counting
            break;
        }
    }

    return streak;
};

// Toggle habit completion for a date
router.post('/:id/toggle', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { date } = z.object({ date: z.string() }).parse(req.body);

    const habit = await prisma.habit.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!habit) throw new ApiError('Habit not found', 404);

    let completedDates = [...habit.completedDates];
    const isCompleted = completedDates.includes(date);

    if (isCompleted) {
        // Remove date
        completedDates = completedDates.filter(d => d !== date);
    } else {
        // Add date if not present
        completedDates.push(date);
        
        // Add XP only if completing for today
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
            await prisma.user.update({
                where: { id: req.user!.id },
                data: { xp: { increment: 5 } },
            });
        }
    }

    // Recalculate streak based on all dates
    const newStreak = calculateStreak(completedDates);
    const newBestStreak = Math.max(habit.bestStreak, newStreak);

    const updatedHabit = await prisma.habit.update({
        where: { id },
        data: {
            completedDates,
            streak: newStreak,
            bestStreak: newBestStreak,
        },
    });

    res.json(updatedHabit);
}));

// Update habit
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = habitSchema.partial().parse(req.body);

    const existing = await prisma.habit.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Habit not found', 404);

    const habit = await prisma.habit.update({ where: { id }, data });
    res.json(habit);
}));

// Delete habit
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.habit.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Habit not found', 404);

    await prisma.habit.delete({ where: { id } });
    res.json({ message: 'Habit deleted' });
}));

export default router;

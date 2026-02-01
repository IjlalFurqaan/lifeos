import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user profile with stats
router.get('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            xp: true,
            level: true,
            streak: true,
            lastActiveAt: true,
            createdAt: true,
            _count: {
                select: {
                    goals: true,
                    tasks: true,
                    habits: true,
                    focusSessions: true,
                    achievements: true,
                },
            },
        },
    });

    res.json(user);
}));

// Update user profile
router.patch('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
    const schema = z.object({
        name: z.string().min(1).optional(),
        avatar: z.string().url().optional().nullable(),
    });

    const data = schema.parse(req.body);

    const user = await prisma.user.update({
        where: { id: req.user!.id },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            xp: true,
            level: true,
            streak: true,
        },
    });

    res.json(user);
}));

// Add XP
router.post('/xp', asyncHandler(async (req: AuthRequest, res: Response) => {
    const schema = z.object({ amount: z.number().int().min(1) });
    const { amount } = schema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new ApiError('User not found', 404);

    const newXp = user.xp + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;

    const updatedUser = await prisma.user.update({
        where: { id: req.user!.id },
        data: { xp: newXp, level: newLevel },
        select: { xp: true, level: true },
    });

    res.json({ ...updatedUser, xpAdded: amount });
}));

// Get user stats
router.get('/stats', asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const [
        goalsCount,
        tasksCompleted,
        tasksPending,
        habitsCount,
        focusMinutes,
        achievementsCount,
    ] = await Promise.all([
        prisma.goal.count({ where: { userId, completedAt: null } }),
        prisma.task.count({ where: { userId, completed: true } }),
        prisma.task.count({ where: { userId, completed: false } }),
        prisma.habit.count({ where: { userId } }),
        prisma.focusSession.aggregate({ where: { userId }, _sum: { duration: true } }),
        prisma.achievement.count({ where: { userId } }),
    ]);

    res.json({
        activeGoals: goalsCount,
        tasksCompleted,
        tasksPending,
        habitsTracked: habitsCount,
        totalFocusMinutes: focusMinutes._sum.duration || 0,
        achievementsUnlocked: achievementsCount,
    });
}));

export default router;

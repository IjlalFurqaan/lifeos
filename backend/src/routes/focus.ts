import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { UserService } from '../services/UserService.js';

const router = Router();

router.use(authenticate);

const sessionSchema = z.object({
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    type: z.enum(['pomodoro', 'shortBreak', 'longBreak']).default('pomodoro'),
});

// Get focus sessions
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const sessions = await prisma.focusSession.findMany({
        where: { userId: req.user!.id },
        orderBy: { completedAt: 'desc' },
        take: 50,
    });
    res.json(sessions);
}));

// Get focus stats
router.get('/stats', asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, todayTotal, sessionsCount] = await Promise.all([
        prisma.focusSession.aggregate({
            where: { userId },
            _sum: { duration: true },
        }),
        prisma.focusSession.aggregate({
            where: { userId, completedAt: { gte: today } },
            _sum: { duration: true },
        }),
        prisma.focusSession.count({ where: { userId } }),
    ]);

    res.json({
        totalMinutes: total._sum.duration || 0,
        todayMinutes: todayTotal._sum.duration || 0,
        totalSessions: sessionsCount,
    });
}));

// Create focus session
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = sessionSchema.parse(req.body);

    const session = await prisma.focusSession.create({
        data: { ...data, userId: req.user!.id },
    });

    // Add XP for focus session
    const xpAmount = data.type === 'pomodoro' ? 20 : 5;
    await UserService.addXp(req.user!.id, xpAmount);

    res.status(201).json(session);
}));

export default router;

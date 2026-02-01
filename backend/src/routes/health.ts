import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const healthEntrySchema = z.object({
    date: z.string().datetime().optional(),
    waterIntake: z.number().min(0).default(0),
    sleepHours: z.number().min(0).max(24).default(0),
    mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible']).optional(),
});

const workoutSchema = z.object({
    type: z.string().min(1),
    duration: z.number().min(1),
    caloriesBurned: z.number().optional(),
    notes: z.string().optional(),
});

// Get health entries
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const entries = await prisma.healthEntry.findMany({
        where: { userId: req.user!.id },
        include: { workouts: true },
        orderBy: { date: 'desc' },
        take: 30,
    });
    res.json(entries);
}));

// Get or create today's entry
router.get('/today', asyncHandler(async (req: AuthRequest, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let entry = await prisma.healthEntry.findFirst({
        where: {
            userId: req.user!.id,
            date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        },
        include: { workouts: true },
    });

    if (!entry) {
        entry = await prisma.healthEntry.create({
            data: { userId: req.user!.id, date: today },
            include: { workouts: true },
        });
    }

    res.json(entry);
}));

// Update health entry
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = healthEntrySchema.partial().parse(req.body);

    const existing = await prisma.healthEntry.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Entry not found', 404);

    const entry = await prisma.healthEntry.update({
        where: { id },
        data,
        include: { workouts: true },
    });

    res.json(entry);
}));

// Add workout to entry
router.post('/:id/workouts', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = workoutSchema.parse(req.body);

    const existing = await prisma.healthEntry.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Entry not found', 404);

    const workout = await prisma.workout.create({
        data: { ...data, healthEntryId: id },
    });

    // Add XP for workout
    await prisma.user.update({
        where: { id: req.user!.id },
        data: { xp: { increment: 15 } },
    });

    res.status(201).json(workout);
}));

export default router;

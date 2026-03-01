import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const goalSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.enum(['career', 'health', 'finance', 'personal', 'learning']).default('personal'),
    progress: z.number().min(0).max(100).default(0),
    targetDate: z.string().datetime().optional(),
    milestones: z.array(z.object({
        title: z.string(),
        completed: z.boolean().default(false),
    })).optional(),
});

// Get all goals
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const goals = await prisma.goal.findMany({
        where: { userId: req.user!.id },
        include: { milestones: true },
        orderBy: { createdAt: 'desc' },
    });
    res.json(goals);
}));

// Create goal
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { milestones, targetDate, ...data } = goalSchema.parse(req.body);

    const goal = await prisma.goal.create({
        data: {
            ...data,
            targetDate: targetDate ? new Date(targetDate) : null,
            userId: req.user!.id,
            milestones: milestones ? {
                create: milestones,
            } : undefined,
        },
        include: { milestones: true },
    });

    res.status(201).json(goal);
}));

// Update goal
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { milestones, targetDate, ...data } = goalSchema.partial().parse(req.body);

    // Verify ownership
    const existing = await prisma.goal.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Goal not found', 404);

    const goal = await prisma.goal.update({
        where: { id },
        data: {
            ...data,
            targetDate: targetDate ? new Date(targetDate) : undefined,
            completedAt: data.progress === 100 ? new Date() : null,
        },
        include: { milestones: true },
    });

    res.json(goal);
}));

// Delete goal
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.goal.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Goal not found', 404);

    await prisma.goal.delete({ where: { id } });
    res.json({ message: 'Goal deleted' });
}));

export default router;

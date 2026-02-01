import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { UserService } from '../services/UserService.js';

const router = Router();

router.use(authenticate);

const learningSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['course', 'book', 'skill', 'project']).default('course'),
    category: z.string().default('general'),
    progress: z.number().min(0).max(100).default(0),
    notes: z.string().optional(),
    url: z.string().url().optional(),
});

// Get all learning items
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const items = await prisma.learningItem.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
    });
    res.json(items);
}));

// Create learning item
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = learningSchema.parse(req.body);

    const item = await prisma.learningItem.create({
        data: { ...data, userId: req.user!.id },
    });

    res.status(201).json(item);
}));

// Update learning item
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = learningSchema.partial().parse(req.body);

    const existing = await prisma.learningItem.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Item not found', 404);

    const item = await prisma.learningItem.update({
        where: { id },
        data: {
            ...data,
            completedAt: data.progress === 100 ? new Date() : null,
        },
    });

    // Add XP if completed
    if (data.progress === 100 && existing.progress !== 100) {
        await UserService.addXp(req.user!.id, 50);
    }

    res.json(item);
}));

// Delete learning item
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.learningItem.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Item not found', 404);

    await prisma.learningItem.delete({ where: { id } });
    res.json({ message: 'Item deleted' });
}));

export default router;

import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { UserService } from '../services/UserService.js';

const router = Router();

router.use(authenticate);

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['urgent', 'high', 'medium', 'low']).default('medium'),
    category: z.string().default('general'),
    dueDate: z.string().datetime().optional(),
});

// Get all tasks
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { completed, priority } = req.query;

    const tasks = await prisma.task.findMany({
        where: {
            userId: req.user!.id,
            ...(completed !== undefined && { completed: completed === 'true' }),
            ...(priority && { priority: priority as string }),
        },
        orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(tasks);
}));

// Create task
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { dueDate, ...data } = taskSchema.parse(req.body);

    const task = await prisma.task.create({
        data: {
            ...data,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: req.user!.id,
        },
    });

    res.status(201).json(task);
}));

// Update task
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const updateSchema = taskSchema.partial().extend({
        completed: z.boolean().optional(),
    });
    const { dueDate, ...data } = updateSchema.parse(req.body);

    const existing = await prisma.task.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Task not found', 404);

    const task = await prisma.task.update({
        where: { id },
        data: {
            ...data,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            completedAt: data.completed ? new Date() : null,
        },
    });

    // Add XP if task completed
    if (data.completed && !existing.completed) {
        await UserService.addXp(req.user!.id, 10);
    }

    res.json(task);
}));

// Delete task
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.task.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Task not found', 404);

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
}));

export default router;

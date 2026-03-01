import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const ideaSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    category: z.string().default('general'),
    tags: z.array(z.string()).default([]),
    isPinned: z.boolean().default(false),
});

// Get all ideas
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { search, category } = req.query;

    const ideas = await prisma.idea.findMany({
        where: {
            userId: req.user!.id,
            ...(category && { category: category as string }),
            ...(search && {
                OR: [
                    { title: { contains: search as string, mode: 'insensitive' } },
                    { content: { contains: search as string, mode: 'insensitive' } },
                ],
            }),
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
    res.json(ideas);
}));

// Create idea
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = ideaSchema.parse(req.body);

    const idea = await prisma.idea.create({
        data: { ...data, userId: req.user!.id },
    });

    res.status(201).json(idea);
}));

// Update idea
router.patch('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = ideaSchema.partial().parse(req.body);

    const existing = await prisma.idea.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Idea not found', 404);

    const idea = await prisma.idea.update({ where: { id }, data });
    res.json(idea);
}));

// Toggle pin
router.post('/:id/toggle-pin', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.idea.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Idea not found', 404);

    const idea = await prisma.idea.update({
        where: { id },
        data: { isPinned: !existing.isPinned },
    });
    res.json(idea);
}));

// Delete idea
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.idea.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Idea not found', 404);

    await prisma.idea.delete({ where: { id } });
    res.json({ message: 'Idea deleted' });
}));

export default router;

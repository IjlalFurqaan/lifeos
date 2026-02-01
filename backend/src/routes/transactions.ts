import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

const transactionSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
});

// Get all transactions
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, startDate, endDate } = req.query;

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: req.user!.id,
            ...(type && { type: type as string }),
            ...(startDate && endDate && {
                date: {
                    gte: new Date(startDate as string),
                    lte: new Date(endDate as string),
                },
            }),
        },
        orderBy: { date: 'desc' },
    });

    res.json(transactions);
}));

// Get summary
router.get('/summary', asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const [income, expenses] = await Promise.all([
        prisma.transaction.aggregate({
            where: { userId, type: 'income' },
            _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
            where: { userId, type: 'expense' },
            _sum: { amount: true },
        }),
    ]);

    res.json({
        totalIncome: income._sum.amount || 0,
        totalExpenses: expenses._sum.amount || 0,
        balance: (income._sum.amount || 0) - (expenses._sum.amount || 0),
    });
}));

// Create transaction
router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { date, ...data } = transactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
        data: {
            ...data,
            date: date ? new Date(date) : new Date(),
            userId: req.user!.id,
        },
    });

    res.status(201).json(transaction);
}));

// Delete transaction
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.transaction.findFirst({
        where: { id, userId: req.user!.id },
    });
    if (!existing) throw new ApiError('Transaction not found', 404);

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted' });
}));

export default router;

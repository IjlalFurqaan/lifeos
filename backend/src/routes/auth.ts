import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

// Generate JWT token
const generateToken = (userId: string, email: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    return jwt.sign(
        { userId, email },
        secret,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );
};

// Register
router.post('/register', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, name } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ApiError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
        select: {
            id: true,
            email: true,
            name: true,
            xp: true,
            level: true,
            streak: true,
            createdAt: true,
        },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
        message: 'Registration successful',
        token,
        user,
    });
}));

// Login
router.post('/login', asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError('Invalid email or password', 401);
    }

    // Update last active
    await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            xp: user.xp,
            level: user.level,
            streak: user.streak,
        },
    });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
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
        },
    });

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    res.json(user);
}));

// Logout (client-side token removal, but we can use this for logging)
router.post('/logout', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
    // Could add token blacklisting here if needed
    res.json({ message: 'Logout successful' });
}));

export default router;

import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Request/Response schemas
const RegisterRequestSchema = z.object({
  email: z.string().email('Valid email required'),
  name: z.string().min(1, 'Name required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationName: z.string().min(1, 'Organization name required'),
});

const LoginRequestSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    role: z.enum(['OWNER', 'ADMIN', 'AUDITOR', 'MANAGER', 'CONTRIBUTOR', 'READONLY']),
    organizationId: z.string(),
  }),
  organization: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/**
 * Register new user and organization
 */
export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterRequestSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(data.password);

    // Create organization slug
    const slug = data.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Organization name already taken',
      });
    }

    // Create organization and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug,
        },
      });

      // Create user as owner
      const user = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          role: 'OWNER',
          organizationId: organization.id,
        },
        include: {
          organization: true,
        },
      });

      return { user, organization };
    });

    // Generate JWT token
    const token = AuthService.generateToken({
      userId: result.user.id,
      email: result.user.email,
      organizationId: result.organization.id,
      role: result.user.role,
    });

    logger.info('User registered successfully', {
      userId: result.user.id,
      email: result.user.email,
      organizationId: result.organization.id,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        organizationId: result.user.organizationId,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.errors,
      });
    }

    logger.error('Registration failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      email: req.body?.email 
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Registration failed',
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginRequestSchema.parse(req.body);

    // Find user with organization
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        organization: true,
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Account is deactivated',
      });
    }

    // Verify password
    const isValidPassword = await AuthService.comparePassword(data.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    });

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.errors,
      });
    }

    logger.error('Login failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      email: req.body?.email 
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed',
    });
  }
};

/**
 * Get current user profile
 */
export const profile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
    });
  } catch (error) {
    logger.error('Profile fetch failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: req.user?.userId 
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user profile',
    });
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (req: Request, res: Response) => {
  logger.info('User logged out', { 
    userId: req.user?.userId,
    email: req.user?.email 
  });

  res.json({
    message: 'Logged out successfully',
  });
};
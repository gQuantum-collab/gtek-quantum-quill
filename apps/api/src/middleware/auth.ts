import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// JWT payload schema
const JwtPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  organizationId: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'AUDITOR', 'MANAGER', 'CONTRIBUTOR', 'READONLY']),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  private static readonly SALT_ROUNDS = 12;

  /**
   * Generate JWT token for user
   */
  static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = {
      expiresIn: '24h',
      issuer: 'gtek-quantum-quill',
      audience: 'api-users',
    };
    return jwt.sign(payload, this.JWT_SECRET, options);
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return JwtPayloadSchema.parse(decoded);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Get user with organization from database
   */
  static async getUserWithOrganization(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });
  }
}

/**
 * Authentication middleware
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Bearer token required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = AuthService.verifyToken(token);

    // Verify user still exists and is active
    const user = await AuthService.getUserWithOrganization(payload.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found or inactive',
      });
    }

    // Attach user to request
    req.user = payload;
    
    logger.info('User authenticated', {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      path: req.path,
      method: req.method,
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      ip: req.ip 
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Authorization middleware - check user role
 */
export const authorize = (requiredRoles: JwtPayload['role'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role;
    
    // Define role hierarchy (higher index = more permissions)
    const roleHierarchy = ['READONLY', 'CONTRIBUTOR', 'MANAGER', 'AUDITOR', 'ADMIN', 'OWNER'];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    
    const hasPermission = requiredRoles.some(role => {
      const requiredRoleIndex = roleHierarchy.indexOf(role);
      return userRoleIndex >= requiredRoleIndex;
    });

    if (!hasPermission) {
      logger.warn('Authorization failed', {
        userId: req.user.userId,
        userRole,
        requiredRoles,
        path: req.path,
        method: req.method,
      });
      
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Required: ${requiredRoles.join(' or ')}`,
      });
    }

    next();
  };
};

/**
 * Organization ownership middleware - ensure user belongs to the organization
 */
export const requireOrganizationAccess = (orgIdParam = 'organizationId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const requestedOrgId = req.params[orgIdParam] || req.body.organizationId;
    
    if (requestedOrgId && requestedOrgId !== req.user.organizationId) {
      logger.warn('Organization access denied', {
        userId: req.user.userId,
        userOrgId: req.user.organizationId,
        requestedOrgId,
        path: req.path,
      });
      
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied to this organization',
      });
    }

    next();
  };
};
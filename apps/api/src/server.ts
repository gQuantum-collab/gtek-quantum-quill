import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import { authenticate, authorize } from './middleware/auth.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Protected API routes
app.get('/api/organizations', authenticate, authorize(['OWNER', 'ADMIN']), async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: { users: true, projects: true },
        },
      },
    });
    res.json(organizations);
  } catch (error) {
    logger.error('Failed to fetch organizations', { error });
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

app.get('/api/users', authenticate, authorize(['OWNER', 'ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: req.user!.organizationId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    res.json(users);
  } catch (error) {
    logger.error('Failed to fetch users', { error });
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/projects', authenticate, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { orgId: req.user!.organizationId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
    res.json(projects);
  } catch (error) {
    logger.error('Failed to fetch projects', { error });
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { 
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`🚀 API server running on http://localhost:${PORT}`);
  logger.info(`📋 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
});
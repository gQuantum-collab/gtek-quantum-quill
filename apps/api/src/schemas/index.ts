import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// ============================================================================
// ENUMS & COMMON TYPES
// ============================================================================

export const RoleEnum = z.enum([
  'OWNER',
  'ADMIN', 
  'AUDITOR',
  'MANAGER',
  'CONTRIBUTOR',
  'READONLY'
]).openapi({
  description: 'User roles with hierarchical permissions'
});

export const StatusEnum = z.enum([
  'TODO',
  'IN_PROGRESS', 
  'REVIEW',
  'DONE',
  'CANCELLED'
]).openapi({
  description: 'Task/Project status'
});

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const RegisterRequestSchema = z.object({
  orgName: z.string().min(1).max(100).openapi({
    description: 'Organization name',
    example: 'Acme Corp'
  }),
  email: z.string().email().openapi({
    description: 'User email address',
    example: 'admin@acme.com'
  }),
  name: z.string().min(1).max(100).openapi({
    description: 'User full name', 
    example: 'John Doe'
  }),
  password: z.string().min(8).max(100).openapi({
    description: 'Password (min 8 characters)',
    example: 'password123'
  })
}).openapi({
  description: 'User registration request'
});

export const LoginRequestSchema = z.object({
  email: z.string().email().openapi({
    description: 'User email address'
  }),
  password: z.string().openapi({
    description: 'User password'
  })
}).openapi({
  description: 'User login request'
});

export const AuthResponseSchema = z.object({
  token: z.string().openapi({
    description: 'JWT authentication token'
  }),
  user: z.object({
    id: z.string().openapi({ description: 'User ID' }),
    email: z.string().email().openapi({ description: 'User email' }),
    name: z.string().openapi({ description: 'User name' }),
    role: RoleEnum,
    orgId: z.string().openapi({ description: 'Organization ID' }),
    createdAt: z.string().datetime().openapi({ description: 'Creation timestamp' })
  }).openapi({ description: 'User information' })
}).openapi({
  description: 'Authentication response'
});

// ============================================================================
// ORGANIZATION SCHEMAS
// ============================================================================

export const OrganizationSchema = z.object({
  id: z.string().openapi({ description: 'Organization ID' }),
  name: z.string().openapi({ description: 'Organization name' }),
  slug: z.string().openapi({ description: 'URL-friendly organization identifier' }),
  settings: z.record(z.any()).optional().openapi({ 
    description: 'Organization settings JSON' 
  }),
  createdAt: z.string().datetime().openapi({ description: 'Creation timestamp' }),
  updatedAt: z.string().datetime().openapi({ description: 'Last update timestamp' })
}).openapi({
  description: 'Organization entity'
});

// ============================================================================
// PROJECT SCHEMAS  
// ============================================================================

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200).openapi({
    description: 'Project name',
    example: 'Q4 Marketing Campaign'
  }),
  description: z.string().optional().openapi({
    description: 'Project description'
  }),
  status: StatusEnum.default('TODO'),
  dueAt: z.string().datetime().optional().openapi({
    description: 'Project due date'
  }),
  tags: z.array(z.string()).optional().openapi({
    description: 'Project tags'
  })
}).openapi({
  description: 'Create project request'
});

export const ProjectSchema = z.object({
  id: z.string().openapi({ description: 'Project ID' }),
  name: z.string().openapi({ description: 'Project name' }),
  description: z.string().nullable().openapi({ description: 'Project description' }),
  status: StatusEnum,
  orgId: z.string().openapi({ description: 'Organization ID' }),
  ownerId: z.string().openapi({ description: 'Project owner ID' }),
  dueAt: z.string().datetime().nullable().openapi({ description: 'Due date' }),
  tags: z.array(z.string()).openapi({ description: 'Project tags' }),
  createdAt: z.string().datetime().openapi({ description: 'Creation timestamp' }),
  updatedAt: z.string().datetime().openapi({ description: 'Last update timestamp' })
}).openapi({
  description: 'Project entity'
});

// ============================================================================
// TASK SCHEMAS
// ============================================================================

export const CreateTaskSchema = z.object({
  projectId: z.string().openapi({
    description: 'Parent project ID',
    example: 'proj_123'
  }),
  title: z.string().min(1).max(300).openapi({
    description: 'Task title',
    example: 'Review Q3 metrics'
  }),
  description: z.string().optional().openapi({
    description: 'Task description'
  }),
  status: StatusEnum.default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM').openapi({
    description: 'Task priority level'
  }),
  assigneeId: z.string().optional().openapi({
    description: 'Assigned user ID'
  }),
  dueAt: z.string().datetime().optional().openapi({
    description: 'Task due date'
  }),
  tags: z.array(z.string()).optional().openapi({
    description: 'Task tags'
  })
}).openapi({
  description: 'Create task request'
});

export const TaskSchema = z.object({
  id: z.string().openapi({ description: 'Task ID' }),
  title: z.string().openapi({ description: 'Task title' }),
  description: z.string().nullable().openapi({ description: 'Task description' }),
  status: StatusEnum,
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).openapi({
    description: 'Task priority'
  }),
  projectId: z.string().openapi({ description: 'Parent project ID' }),
  orgId: z.string().openapi({ description: 'Organization ID' }),
  assigneeId: z.string().nullable().openapi({ description: 'Assigned user ID' }),
  creatorId: z.string().openapi({ description: 'Task creator ID' }),
  dueAt: z.string().datetime().nullable().openapi({ description: 'Due date' }),
  tags: z.array(z.string()).openapi({ description: 'Task tags' }),
  createdAt: z.string().datetime().openapi({ description: 'Creation timestamp' }),
  updatedAt: z.string().datetime().openapi({ description: 'Last update timestamp' })
}).openapi({
  description: 'Task entity'
});

// ============================================================================
// LEDGER SCHEMAS
// ============================================================================

export const LedgerEventSchema = z.object({
  id: z.string().openapi({ description: 'Event ID' }),
  entity: z.string().openapi({ description: 'Entity type (Project, Task, etc.)' }),
  entityId: z.string().openapi({ description: 'Entity ID' }),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']).openapi({
    description: 'Action performed'
  }),
  data: z.record(z.any()).openapi({ description: 'Event data' }),
  userId: z.string().openapi({ description: 'User who performed action' }),
  orgId: z.string().openapi({ description: 'Organization ID' }),
  hash: z.string().openapi({ description: 'Event hash' }),
  prevHash: z.string().openapi({ description: 'Previous event hash' }),
  timestamp: z.string().datetime().openapi({ description: 'Event timestamp' })
}).openapi({
  description: 'Ledger event'
});

export const AppendLedgerSchema = z.object({
  entity: z.string().min(1).openapi({
    description: 'Entity type',
    example: 'Project'
  }),
  entityId: z.string().min(1).openapi({
    description: 'Entity ID', 
    example: 'proj_123'
  }),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']).openapi({
    description: 'Action type'
  }),
  data: z.record(z.any()).openapi({
    description: 'Action data',
    example: { name: 'New Project' }
  })
}).openapi({
  description: 'Append ledger event request'
});

// ============================================================================
// COMMON RESPONSE SCHEMAS
// ============================================================================

export const ErrorResponseSchema = z.object({
  error: z.string().openapi({ description: 'Error message' }),
  code: z.string().optional().openapi({ description: 'Error code' }),
  details: z.record(z.any()).optional().openapi({ description: 'Error details' })
}).openapi({
  description: 'Error response'
});

export const HealthResponseSchema = z.object({
  status: z.literal('ok').openapi({ description: 'Health status' }),
  timestamp: z.string().datetime().openapi({ description: 'Check timestamp' }),
  version: z.string().openapi({ description: 'API version' })
}).openapi({
  description: 'Health check response'
});

// ============================================================================
// EXPORTS
// ============================================================================

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type LedgerEvent = z.infer<typeof LedgerEventSchema>;
export type AppendLedger = z.infer<typeof AppendLedgerSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type Role = z.infer<typeof RoleEnum>;
export type Status = z.infer<typeof StatusEnum>;
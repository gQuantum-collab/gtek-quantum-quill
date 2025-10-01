#!/usr/bin/env tsx

import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Import all schemas
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  AuthResponseSchema,
  CreateProjectSchema,
  ProjectSchema,
  CreateTaskSchema,
  TaskSchema,
  LedgerEventSchema,
  AppendLedgerSchema,
  ErrorResponseSchema,
  HealthResponseSchema,
  RoleEnum,
  StatusEnum
} from '../src/schemas/index.js';

const registry = new OpenAPIRegistry();

// Register all schemas
registry.register('Role', RoleEnum);
registry.register('Status', StatusEnum);
registry.register('RegisterRequest', RegisterRequestSchema);
registry.register('LoginRequest', LoginRequestSchema);
registry.register('AuthResponse', AuthResponseSchema);
registry.register('CreateProject', CreateProjectSchema);
registry.register('Project', ProjectSchema);
registry.register('CreateTask', CreateTaskSchema);
registry.register('Task', TaskSchema);
registry.register('LedgerEvent', LedgerEventSchema);
registry.register('AppendLedger', AppendLedgerSchema);
registry.register('ErrorResponse', ErrorResponseSchema);
registry.register('HealthResponse', HealthResponseSchema);

// Define API paths using schema references
registry.registerPath({
  method: 'get',
  path: '/health',
  description: 'Health check endpoint',
  summary: 'Check API health status',
  responses: {
    200: {
      description: 'Service is healthy',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/HealthResponse' }
        }
      }
    }
  },
  tags: ['System']
});

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  description: 'Register new user and organization',
  summary: 'User registration',
  requestBody: {
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/RegisterRequest' }
      }
    }
  },
  responses: {
    201: {
      description: 'User and organization created successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/AuthResponse' }
        }
      }
    },
    400: {
      description: 'Invalid request data',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  },
  tags: ['Authentication']
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  description: 'Authenticate user and get JWT token',
  summary: 'User login',
  requestBody: {
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/LoginRequest' }
      }
    }
  },
  responses: {
    200: {
      description: 'Authentication successful',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/AuthResponse' }
        }
      }
    },
    401: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  },
  tags: ['Authentication']
});

registry.registerPath({
  method: 'post',
  path: '/projects',
  description: 'Create a new project',
  summary: 'Create project',
  security: [{ bearerAuth: [] }],
  requestBody: {
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/CreateProject' }
      }
    }
  },
  responses: {
    201: {
      description: 'Project created successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Project' }
        }
      }
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  },
  tags: ['Projects']
});

registry.registerPath({
  method: 'get',
  path: '/projects',
  description: 'List all projects in organization',
  summary: 'List projects',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of projects',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Project' }
          }
        }
      }
    }
  },
  tags: ['Projects']
});

registry.registerPath({
  method: 'post',
  path: '/tasks',
  description: 'Create a new task',
  summary: 'Create task',
  security: [{ bearerAuth: [] }],
  requestBody: {
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/CreateTask' }
      }
    }
  },
  responses: {
    201: {
      description: 'Task created successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Task' }
        }
      }
    }
  },
  tags: ['Tasks']
});

registry.registerPath({
  method: 'post',
  path: '/api/ledger/append',
  description: 'Append event to audit ledger',
  summary: 'Append ledger event',
  security: [{ bearerAuth: [] }],
  requestBody: {
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/AppendLedger' }
      }
    }
  },
  responses: {
    201: {
      description: 'Event appended to ledger',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/LedgerEvent' }
        }
      }
    }
  },
  tags: ['Ledger']
});

registry.registerPath({
  method: 'get',
  path: '/api/ledger/verify',
  description: 'Verify ledger integrity',
  summary: 'Verify ledger chain',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Ledger verification result',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ok: { type: 'boolean', description: 'Verification status' },
              eventsCount: { type: 'number', description: 'Total events verified' },
              headHash: { type: 'string', description: 'Latest event hash' },
              timestamp: { type: 'string', format: 'date-time', description: 'Verification timestamp' }
            }
          }
        }
      }
    }
  },
  tags: ['Ledger']
});

// Generate the OpenAPI spec
const generator = new OpenApiGeneratorV3(registry.definitions);
const document = generator.generateDocument({
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Admin Chat & Audit API',
    description: 'Business Admin + Auditing + Real-time Chat with Developer Studio',
    contact: {
      name: 'GTEK Quantum',
      url: 'https://gtekquantum.net'
    },
    license: {
      name: 'MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server'
    },
    {
      url: 'https://api.gtekquantum.net',  
      description: 'Production server'
    }
  ]
});

// Add security schemes manually to the generated document
if (!document.components) {
  document.components = {};
}
document.components.securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
};

// Write to file
const outputPath = resolve(process.cwd(), '../../openapi/api.v1.yaml');
const yamlContent = `# Generated from Zod schemas - DO NOT EDIT MANUALLY
# Run 'pnpm openapi:gen' to regenerate

${JSON.stringify(document, null, 2)}`;

writeFileSync(outputPath, yamlContent, 'utf8');

console.log('✅ OpenAPI specification generated:', outputPath);
console.log('📝 Schemas registered:', Object.keys(registry.definitions).length);

export { registry, document };
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

const app = express();
const port = process.env.PORT || 4000;
const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.WEB_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic auth endpoints (stubs for now)
app.post('/auth/register', (req, res) => {
  res.status(501).json({ 
    error: 'Not implemented yet',
    message: 'Registration endpoint coming soon'
  });
});

app.post('/auth/login', (req, res) => {
  res.status(501).json({ 
    error: 'Not implemented yet',
    message: 'Login endpoint coming soon'
  });
});

// Ledger endpoints (stubs for now)
app.post('/api/ledger/append', (req, res) => {
  res.status(501).json({ 
    error: 'Not implemented yet',
    message: 'Ledger append endpoint coming soon'
  });
});

app.get('/api/ledger/verify', (req, res) => {
  res.json({
    ok: true,
    eventsCount: 0,
    headHash: '0'.repeat(64),
    timestamp: new Date().toISOString(),
    message: 'Verification endpoint stub - implementation coming soon'
  });
});

// OpenAPI docs endpoint
app.get('/docs', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Admin Chat & Audit API</title>
      </head>
      <body>
        <h1>API Documentation</h1>
        <p>OpenAPI documentation will be available here soon.</p>
        <p>Run <code>pnpm openapi:gen</code> to generate the specification.</p>
      </body>
    </html>
  `);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

app.listen(port, () => {
  logger.info(`🚀 API server running on http://localhost:${port}`);
  logger.info(`📚 Docs available at http://localhost:${port}/docs`);
  logger.info(`🔍 Health check: http://localhost:${port}/health`);
});

export default app;
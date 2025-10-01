import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import healthRouter from './routes/health';
import paletteRouter from './routes/palette';
import layoutRouter from './routes/layout';
import exportRouter from './routes/export';
import publishRouter from './routes/publish';
import justcallRouter from './routes/justcall';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/', healthRouter);
app.use('/', paletteRouter);
app.use('/', layoutRouter);
app.use('/', exportRouter);
app.use('/', publishRouter);
app.use('/', justcallRouter);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

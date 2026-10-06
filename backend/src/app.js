import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Voice of Stray API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Voice of Stray API received JSON payload successfully',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRouter);

// Express Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error Middleware]', err.stack || err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

export default app;

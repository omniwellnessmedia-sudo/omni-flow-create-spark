import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './api/routes/agent-endpoints';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Agent API routes
app.use('/api/agents', agentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Omni Wellness API Server running on port ${PORT}`);
  console.log(`📊 Agent endpoints available at http://localhost:${PORT}/api/agents`);
});

export default app;
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { SocketService } from './services/socketService';
import { 
  errorHandler, 
  notFoundHandler, 
  requestLogger, 
  securityHeaders,
  rateLimiter
} from './middleware/errorHandler';
import { projectRoutes } from './routes/projectRoutes';
import { communicationRoutes } from './routes/communicationRoutes';
import { actionRoutes } from './routes/actionRoutes';
import { weatherRoutes } from './routes/weatherRoutes';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Initialize Socket.IO service
SocketService.initialize(io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
app.use(securityHeaders);
app.use(rateLimiter(5000, 15 * 60 * 1000)); // 5,000 requests per 15 minutes for development


// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/weather', weatherRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Automatic real-time updates every 2 minutes (120,000 ms)
const startRealTimeUpdates = () => {
  setInterval(() => {
    
    // Simulate new communication
    SocketService.emitToAll('communication-new', {
      id: `comm-${Date.now()}`,
      type: 'status-update',
      title: 'Automatic Status Update',
      content: 'This is an automatic real-time update from the system.',
      priority: 'normal',
      source: 'system',
      projectId: 'auto-update',
      tags: ['automatic', 'system'],
      postedAt: new Date().toISOString(),
      isAI: false
    });
    
    // Simulate weather update
    SocketService.emitToAll('weather-update', {
      temperature: Math.floor(Math.random() * 30) + 15,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 30,
      pressure: 1000 + Math.floor(Math.random() * 30),
      updatedAt: new Date().toISOString()
    });
    
    // Simulate project update
    SocketService.emitToAll('project-update', {
      id: 'site-alpha',
      progress: Math.floor(Math.random() * 20) + 70,
      updatedAt: new Date().toISOString()
    });
    
    // Simulate AI insight
    SocketService.emitToAll('ai-insight', {
      id: `insight-${Date.now()}`,
      type: 'risk-detection',
      message: 'Schedule conflict detected between equipment delivery and site preparation phases.',
      priority: 'high',
      timestamp: new Date().toISOString()
    });
    
  }, 120000); // 2 minutes
};

const PORT = process.env.PORT || 3001;

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`Alfred Backend running on port ${PORT}`);
      
      // Start automatic real-time updates
      startRealTimeUpdates();
      console.log('Automatic updates scheduled every 2 minutes');
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
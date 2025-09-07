import { Server as SocketIOServer } from 'socket.io';

export class SocketService {
  private static io: SocketIOServer | null = null;

  /**
   * Initialize Socket.IO server
   */
  static initialize(io: SocketIOServer): void {
    this.io = io;
    this.setupEventHandlers();
  }

  /**
   * Get Socket.IO instance
   */
  static getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Setup Socket.IO event handlers
   */
  private static setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle project room joining
      socket.on('join-project', (projectId: string) => {
        socket.join(`project-${projectId}`);
        console.log(`Client ${socket.id} joined project ${projectId}`);
      });

      // Handle project room leaving
      socket.on('leave-project', (projectId: string) => {
        socket.leave(`project-${projectId}`);
        console.log(`Client ${socket.id} left project ${projectId}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      // Handle custom events
      socket.on('custom-event', (data) => {
        console.log('Custom event received:', data);
        // Handle custom events as needed
      });
    });
  }

  /**
   * Emit event to all connected clients
   */
  static emitToAll(event: string, data: any): void {
    if (this.io) {
      this.io.emit(event, data);
      console.log(`Emitted '${event}' to all clients`);
    }
  }

  /**
   * Emit event to specific project room
   */
  static emitToProject(projectId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`project-${projectId}`).emit(event, data);
      console.log(`Emitted '${event}' to project ${projectId}`);
    }
  }

  /**
   * Emit event to specific client
   */
  static emitToClient(socketId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(socketId).emit(event, data);
      console.log(`📡 Emitted '${event}' to client ${socketId}`);
    }
  }

  /**
   * Broadcast event to all clients except sender
   */
  static broadcastToOthers(socketId: string, event: string, data: any): void {
    if (this.io) {
      this.io.except(socketId).emit(event, data);
      console.log(`Broadcasted '${event}' to all clients except ${socketId}`);
    }
  }

  /**
   * Get connected clients count
   */
  static getConnectedClientsCount(): number {
    return this.io ? this.io.engine.clientsCount : 0;
  }

  /**
   * Get all connected socket IDs
   */
  static getConnectedSocketIds(): string[] {
    if (!this.io) return [];
    
    const sockets = this.io.sockets.sockets;
    return Array.from(sockets.keys());
  }

  /**
   * Check if client is connected
   */
  static isClientConnected(socketId: string): boolean {
    if (!this.io) return false;
    
    const sockets = this.io.sockets.sockets;
    return sockets.has(socketId);
  }

  /**
   * Emit project updates
   */
  static emitProjectUpdate(projectId: string, updateData: any): void {
    this.emitToProject(projectId, 'project-update', updateData);
  }

  /**
   * Emit communication updates
   */
  static emitCommunicationUpdate(projectId: string, updateData: any): void {
    this.emitToProject(projectId, 'communication-update', updateData);
  }

  /**
   * Emit action updates
   */
  static emitActionUpdate(projectId: string, updateData: any): void {
    this.emitToProject(projectId, 'action-update', updateData);
  }

  /**
   * Emit weather updates
   */
  static emitWeatherUpdate(updateData: any): void {
    this.emitToAll('weather-update', updateData);
  }

  /**
   * Emit AI insights
   */
  static emitAIInsight(insightData: any): void {
    this.emitToAll('ai-insight', insightData);
  }

  /**
   * Emit system notifications
   */
  static emitSystemNotification(notification: any): void {
    this.emitToAll('system-notification', notification);
  }

  /**
   * Emit error notifications
   */
  static emitErrorNotification(error: any): void {
    this.emitToAll('error-notification', error);
  }

  /**
   * Emit success notifications
   */
  static emitSuccessNotification(message: string, data?: any): void {
    this.emitToAll('success-notification', { message, data });
  }

  /**
   * Emit warning notifications
   */
  static emitWarningNotification(message: string, data?: any): void {
    this.emitToAll('warning-notification', { message, data });
  }

  /**
   * Emit info notifications
   */
  static emitInfoNotification(message: string, data?: any): void {
    this.emitToAll('info-notification', { message, data });
  }
}

import amqp from 'amqplib';

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost:5672';

console.log('....RABBIT_URL.....', RABBIT_URL);

class RabbitMQPublisher {
  private static ch: amqp.Channel | null = null;
  private static conn: amqp.Connection | null = null;
  private static isInitializing: boolean = false;
  private static initPromise: Promise<void> | null = null;

  static async initialize(): Promise<void> {
    // Prevent multiple simultaneous initialization attempts
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    if (this.ch && this.conn) {
      try {
        // Test if connection is still alive by checking if we can create a channel
        const testChannel = await this.conn.createChannel();
        await testChannel.close();
        return; // Already initialized and connection is still alive
      } catch (error) {
        // Connection is dead, continue with reinitialization
        console.log('🔄 Existing connection is dead, reinitializing...');
      }
    }

    this.isInitializing = true;
    
    this.initPromise = this._doInitialize();
    
    try {
      await this.initPromise;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  private static async _doInitialize(): Promise<void> {
    try {
      // Close existing connections if any
      await this.close();

      console.log('🔄 Connecting to RabbitMQ at:', RABBIT_URL);
      
      // Use environment variable instead of hardcoded URL
      this.conn = await amqp.connect(RABBIT_URL, {
        heartbeat: 60, // Increased heartbeat
        connectionTimeout: 10000, // Reduced timeout
        // Add retry logic
        socketOptions: {
          timeout: 10000,
          noDelay: true,
          keepAlive: true,
          keepAliveDelay: 30000
        }
      });

      // Handle connection errors
      this.conn.on('error', (err) => {
        console.error('❌ RabbitMQ connection error:', err);
        this.cleanup();
      });

      this.conn.on('close', () => {
        console.warn('⚠️ RabbitMQ connection closed');
        this.cleanup();
      });

      this.ch = await this.conn.createChannel();

      // Handle channel errors
      this.ch.on('error', (err) => {
        console.error('❌ RabbitMQ channel error:', err);
        this.ch = null;
      });

      this.ch.on('close', () => {
        console.warn('⚠️ RabbitMQ channel closed');
        this.ch = null;
      });

      // Ensure exchange exists
      await this.ch.assertExchange('healNova', 'topic', { durable: true });
      
      console.log('✅ RabbitMQ Publisher initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize RabbitMQ Publisher:', error);
      this.cleanup();
      throw error;
    }
  }

  private static cleanup(): void {
    this.ch = null;
    this.conn = null;
  }

  static async publish(routingKey: string, data: any): Promise<void> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Check if connection is still alive
        if (!this.ch || !this.conn) {
          console.log('🔄 Initializing RabbitMQ for publishing...');
          await this.initialize();
        } else {
          // Test if connection is still working
          try {
            const testChannel = await this.conn.createChannel();
            await testChannel.close();
          } catch (error) {
            console.log('🔄 Connection test failed, reinitializing...');
            await this.initialize();
          }
        }

        if (!this.ch) {
          throw new Error('RabbitMQ channel not available after initialization');
        }

        const message = Buffer.from(JSON.stringify(data));
        const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const published = this.ch.publish('healNova', routingKey, message, {
          persistent: true,
          messageId,
          timestamp: Date.now(),
          headers: {
            source: 'user-service',
            version: '1.0'
          }
        });

        if (!published) {
          throw new Error('Failed to publish message to RabbitMQ');
        }
        
        console.log(`✅ Published message to ${routingKey}:`, { 
          messageId,
          dataPreview: JSON.stringify(data).slice(0, 100) + '...' 
        });
        
        return; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ Failed to publish to ${routingKey} (attempt ${retryCount}/${maxRetries}):`, error);
        
        // Reset connection on error
        this.cleanup();
        
        if (retryCount >= maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  }

  static async close(): Promise<void> {
    try {
      if (this.ch) {
        await this.ch.close();
      }
      if (this.conn) {
        await this.conn.close();
      }
      console.log('✅ RabbitMQ Publisher connection closed');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ Publisher:', error);
    } finally {
    
      this.cleanup();
    }
  }

  // Health check method
  static isConnected(): boolean {
    if (!this.ch || !this.conn) {
      return false;
    }
    

    return true;
  }
}

export { RabbitMQPublisher };
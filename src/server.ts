import express from 'express';
import 'dotenv/config';
import connectDB from './config/mongo.config';
import morgan from 'morgan';
import cors from 'cors';
import userRoute from './routes/router';
import { startGrpcServer } from './grpc/server';
import { startUserPaymentConsumer } from './consumers/paymentConsumer';

const app = express();

// ---------------------- MIDDLEWARES ----------------------
app.use(morgan('dev'));

// ✅ Setup CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*', // e.g. 'http://localhost:3000'
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true, // allow cookies or authorization headers
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------- ROUTES ----------------------
app.use(userRoute);

// ---------------------- SERVER BOOTSTRAP ----------------------
async function bootstrap() {
    try {
        await connectDB();
        
       
        await startGrpcServer();
        
              await startUserPaymentConsumer();
        console.log('✅ RabbitMQ consumer (payment.user) started');
        app.listen(process.env.PORT!, () => {
            console.log('✅ User-service running on port:', process.env.PORT!);
        });
    } catch (error) {
        console.error('❌ Failed to start services:', error);
        process.exit(1);
    }
}

bootstrap();

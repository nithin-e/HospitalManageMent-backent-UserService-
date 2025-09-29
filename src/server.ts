import 'dotenv/config';
import connectDB from './config/mongo.config';
import { startGrpcServer } from './grpc/server';

async function bootstarp() {
    await connectDB();
    startGrpcServer();
}

bootstarp();

import * as grpc from '@grpc/grpc-js';
import { loadProto, createGrpcServer } from '../config/grpc.config';
import { userGrpcHandlers } from './handlers';

export const startGrpcServer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const grpcObject = loadProto();
        const userProto = grpcObject.user_package;

        if (!userProto || !userProto.User) {
            console.error('❌ Failed to load User service from proto file');
            reject(new Error('Failed to load proto'));
            return;
        }

        const grpcServer = createGrpcServer();
        grpcServer.addService(userProto.User.service, userGrpcHandlers);

        const port = process.env.USER_GRPC_PORT || '3001';
        const host = process.env.USER_GRPC_HOST || '0.0.0.0';
        const serverAddress = `${host}:${port}`;

        grpcServer.bindAsync(
            serverAddress,
            grpc.ServerCredentials.createInsecure(),
            (err, bindPort) => {
                if (err) {
                    console.error('❌ Error starting gRPC User server:', err);
                    reject(err);
                    return;
                }

                grpcServer.start(); 
                console.log(
                    `🚀 [INFO] gRPC USER server running at ${serverAddress} on port ${bindPort} ✅`
                );
                resolve();
            }
        );
    });
};

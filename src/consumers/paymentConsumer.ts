// src/consumers/payment.consumer.ts

import { createRabbit } from '@/config/rabbitmq.config';
import { container } from '../config/inversify.config';
import { TYPES } from '../types/inversify';
import PaymentController from '@/controllers/payment.controller';

export async function startUserPaymentConsumer() {
    try {
        const { ch } = await createRabbit();
        const exchange = 'healNova';
        const queue = 'user_payment_queue';
        const routingKey = 'payment.user';

        await ch.assertQueue(queue, { durable: true });
        await ch.bindQueue(queue, exchange, routingKey);

        console.log(`👂 User-service is listening on routing key: ${routingKey}`);

 const paymentController = container.get<PaymentController>(
    TYPES.DoctorPaymentController
   )

        ch.consume(queue, async (msg) => {
            if (!msg) return;

            try {
                const content = JSON.parse(msg.content.toString());
                console.log('📩 Received payment.user event:', content);

                
                await paymentController.handleStripeWebhookUpdateUser(content);

                ch.ack(msg);
            } catch (err) {
                console.error('❌ Error processing payment.user message:', err);
                ch.nack(msg, false, false); 
            }
        });
    } catch (error) {
        console.error('❌ Failed to start user payment consumer:', error);
    }
}

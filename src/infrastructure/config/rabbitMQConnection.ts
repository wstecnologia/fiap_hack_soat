import amqp from 'amqplib';
 
let connection: amqp.Connection;
 
export async function RabbitMQConnection(): Promise<amqp.Connection> {
  if (!connection) {
    connection = await amqp.connect(process.env.RABBIT_MQ_URL);
  }
  return connection;
}
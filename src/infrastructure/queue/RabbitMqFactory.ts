import { IMessageQueue } from "@/domain/queues/IMessageQueue";
import { UpdateStatusFileUseCase } from "../../application/usecases/UpdateStatusFileUseCase";
import { RabbitMQConnection } from "../config/rabbitMQConnection";
import { FilesMongoRepositorie } from "../repository/FilesMongoRepositorie";

export class RabbitMQFactory implements IMessageQueue {

  constructor(){}

  async publish(data: DataInput): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();
 
      await channel.assertExchange(data.exchange, 'direct', { durable: true });
      await channel.assertQueue(data.queue, { durable: true });
      await channel.bindQueue(data.queue, data.exchange, data.routingKey);
 
      const result = channel.publish(data.exchange, data.routingKey, Buffer.from(JSON.stringify(data.message)));
      
      if(result){
        console.log('Message sent to queue:', data.queue, data.message);
      } else {
        console.log('Message not sent to queue:',data.queue);
      }
 
      await channel.close();
    } catch (error) {
      console.error('Error publishing message to RabbitMQ:', error);
      throw error;
    }
  }

  async on(data: DataInput): Promise<void> {
    try {      
      await this.consume(data); 
    } catch (error) {
      console.error('Error starting the consumer:', error);
      process.exit(1); 
    }
  }

  async consume(data: DataInput): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();
      
      await channel.assertExchange(data.exchange, 'direct', { durable: true });
      await channel.assertQueue(data.queue, { durable: true });
      await channel.bindQueue(data.queue, data.exchange, data.routingKey);

      console.log(`Waiting for messages in queue: ${data.queue}`);
      
      channel.consume(
        data.queue,
        async (msg) => {
          if (msg) {
            const messageContent = msg.content.toString();
            console.log(`${new Date().toLocaleString()}  Message received:`, messageContent);
          
            try {
              const parsedMessage = JSON.parse(messageContent);   
            
              if(parsedMessage){
                const updateStatusUseCase = new UpdateStatusFileUseCase(new FilesMongoRepositorie())
                const input = {
                  id:parsedMessage.id,
                  status:parsedMessage.status,
                  url:parsedMessage.link_file
                }
                await updateStatusUseCase.execute(input)
              }
              

              await this.processMessage(parsedMessage);              
              channel.ack(msg);
            } catch (error) {
              console.error('Error processing message:', error);              
              channel.nack(msg, false, false);
            }
          }
        },
        { noAck: false } 
      );
    } catch (error) {
      console.error('Error consuming messages from RabbitMQ:', error);
      throw error;
    }    
  }


  private async processMessage(message: any): Promise<void> {    
    console.log('Processing message:', message);    
    if (!message) {
      throw new Error('Message does not contain a valid amount.');
    }
    console.log(`Payment of ${JSON.stringify( message )} processed successfully.`);
  }

}


type DataInput = {
  exchange:string
  queue:string
  routingKey:string
  message: object
}
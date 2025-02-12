import { IMessageQueue } from "@/domain/queues/IMessageQueue";
import { RabbitMQConnection } from "../config/rabbitMQConnection";

export class RabbitMQFactory implements IMessageQueue {

  constructor(
    private readonly exchange:string,
    private readonly queue:string,
    private readonly routingKey:string
  ){}

  async publish(message: object): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();
 
      await channel.assertExchange(this.exchange, 'direct', { durable: true });
      await channel.assertQueue(this.queue, { durable: true });
      await channel.bindQueue(this.queue, this.exchange, this.routingKey);
 
      const result = channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(message)));
      
      if(result){
        console.log('Message sent to queue:', this.queue, message);
      } else {
        console.log('Message not sent to queue:',this.queue);
      }
 
      await channel.close();
    } catch (error) {
      console.error('Error publishing message to RabbitMQ:', error);
      throw error;
    }
  }

  /*async on(): Promise<void> {
    try {      
      await this.consume(); 
    } catch (error) {
      console.error('Error starting the consumer:', error);
      process.exit(1); 
    }
  }

  async consume(): Promise<void> {
    try {
      const connection = await RabbitMQConnection();
      const channel = await connection.createChannel();
      
      await channel.assertExchange(this.exchange, 'direct', { durable: true });
      await channel.assertQueue(this.queue, { durable: true });
      await channel.bindQueue(this.queue, this.exchange, this.routingKey);

      console.log(`Waiting for messages in queue: ${this.queue}`);
      
      channel.consume(
        this.queue,
        async (msg) => {
          if (msg) {
            const messageContent = msg.content.toString();
            console.log(`${new Date().toLocaleString()}  Message received:`, messageContent);
          
            try {
              const parsedMessage = JSON.parse(messageContent);   
            
              if(parsedMessage){
                const importController = new ImportFilesControlers ()
                await importController.import(req, res)
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
  }*/


  private async processMessage(message: any): Promise<void> {    
    console.log('Processing message:', message);    
    if (!message) {
      throw new Error('Message does not contain a valid amount.');
    }
    console.log(`Payment of ${JSON.stringify( message )} processed successfully.`);
  }

}
export interface IMessageQueue {
  publish( data: DataInput):Promise<void>
  //on():Promise<void>
  //consume(exchange:string, queue:string, routingKey:string):Promise<void>
}

type DataInput = {
  exchange:string
  queue:string
  routingKey:string
  message: object
}
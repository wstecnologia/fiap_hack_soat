export interface IMessageQueue {
  publish( data: DataInput):Promise<void>
  on(data: DataInput):Promise<void>
  consume(data: DataInput):Promise<void>
}

type DataInput = {
  exchange:string
  queue:string
  routingKey:string
  message: object
}
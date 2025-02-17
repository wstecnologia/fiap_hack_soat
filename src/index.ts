import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { RabbitMQFactory } from './infrastructure/queue/RabbitMqFactory';
import errorHandler from './presentation/middlewares/Auth/errorHandler';
import { router } from './presentation/routes/FileRouters';

const app = express()

app.use(router);
app.use(errorHandler)
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
      swaggerOptions: { persistAuthorization: true },
  }),
)

const rabbitMq = new RabbitMQFactory()
rabbitMq.on({
  exchange:'import_files',
  queue:'fiap_file_completed',
  routingKey:'fiap_file_completed',
  message:null
})

const port = process.env.PORT || 3000


app.listen(port,()=>{
  console.log(`Server online in port ${port}`)
})

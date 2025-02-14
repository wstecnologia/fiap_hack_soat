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

const rabbitMq = new RabbitMQFactory('import_files','fiap_file_completed','fiap_file_completed')
rabbitMq.on()

const port = process.env.PORT || 3000


app.listen(port,()=>{
  console.log(`Server online in port ${port}`)
})

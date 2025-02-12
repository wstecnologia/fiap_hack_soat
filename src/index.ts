import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import errorHandler from './presentation/middlewares/Auth/errorHandler';
import { router } from './presentation/routes/ImportRouters';

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

const port = process.env.PORT || 3000


app.listen(port,()=>{
  console.log(`Server online in port ${port}`)
})

import express from "express";
import { videoRoutes } from "./infrastructure/web/express/routes/videoRoutes";

const app = express()

app.use(express.json()); // Middleware para permitir JSON no body
app.use("/api", videoRoutes); // Prefixo opcional para organizar as rotas

app.listen(3000,()=>{
  console.log('Server online in port 3000')
})

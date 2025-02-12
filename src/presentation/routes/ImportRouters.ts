import { Request, Response, Router } from 'express';
import { ImportFilesControlers } from '../controllers/ImportFilesControlers';
import { authMiddleware } from '../middlewares/Auth/authMiddleware';
import { MulterConfig } from '../middlewares/fileStorage/MulterConfig';

const controller = new ImportFilesControlers()
export const router = Router();
const upload = MulterConfig.getMulterInstance()


router.post('/import', authMiddleware, upload.single('file'), async(req:Request, res:Response)=>{
  try {
  
    const retorno = await controller.import(req)
    
    res.status(200).json(retorno)  
  } catch (error) {
    console.error(error)
    res.status(400).json({message:error.message|| "An error occurred while logging in."})
  }
  
});





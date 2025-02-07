import { Router } from 'express';
import { ImportFilesControlers } from '../controllers/ImportFilesControlers';
import { MulterConfig } from '../middlewares/fileStorage/MulterConfig';

const controller = new ImportFilesControlers()
export const router = Router();
const upload = MulterConfig.getMulterInstance()
router.post('/import',  upload.single('file'), async(req, res)=>{
  try {
    const retorno = await controller.import(req, res)
    
    res.status(200).json(retorno)  
  } catch (error) {
    console.error(error)
    res.status(400).json({message:error.message|| "An error occurred while logging in."})
  }
  
});





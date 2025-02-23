import { Request, Response, Router } from 'express';
import { FilesControllers } from '../controllers/FilesControllers';
import { authMiddleware } from '../middlewares/Auth/authMiddleware';
import { MulterConfig } from '../middlewares/fileStorage/MulterConfig';

const controller = new FilesControllers()

export const router = Router();
const upload = MulterConfig.multerMemoryStorage()


router.post('/import', authMiddleware, upload.single('file'), (req:Request, res:Response)=>{
  try {
  
    if (!req.file) {
      return res.status(400).json({ error: 'File not send' });
    }
    const retorno = controller.import(req)
    
    res.status(200).json(retorno)  
  } catch (error) {
    console.error(error)
    res.status(400).json({message:error.message|| "An error occurred while logging in."})
  }
  
});

router.get('/list', authMiddleware, upload.single('file'), async(req:Request, res:Response)=>{
  try {
  
    const retorno = await controller.getListStatusFilesUsers(req)
    
    res.status(200).json(retorno)  
  } catch (error) {
    console.error(error)
    res.status(400).json({message:error.message|| "An error occurred while logging in."})
  }
  
});

router.put('/update-status', upload.single('file'), async(req:Request, res:Response)=>{
  try {
  
    await controller.updateStatus(req)
    
    res.status(200).json({})  
  } catch (error) {
    console.error(error)
    res.status(400).json({message:error.message|| "An error occurred while logging in."})
  }
  
});




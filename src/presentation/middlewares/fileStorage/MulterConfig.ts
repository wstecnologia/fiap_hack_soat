import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

export class MulterConfig {
  private static uploadPath = path.join(__dirname, '../../uploads');

  static getMulterInstance() {
    // Cria a pasta de upload se não existir
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req:Request, file, cb) => {
        cb(null, this.uploadPath);
      },
      filename: (req:Request, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      }
    });

    return multer({ storage });
  }

  static multerMemoryStorage(){
    const storage = multer.memoryStorage();

    return multer({ storage });
  }
}

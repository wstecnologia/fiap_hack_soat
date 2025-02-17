import { IFileSystemService } from '@/domain/file-handling/IFileSystemService';
import fs from 'fs';
import path from 'path';

export class FileSystemService implements IFileSystemService  {
   createDirectoryIfNotExists(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  readFile(filePath: string): Promise<Buffer> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }
    return fs.promises.readFile(filePath);
  }

  joinPaths(...segments: string[]): string {
    return path.join(...segments);
  }

  outputFolder(){
    return path.join(__dirname, 'Images');
  } 

  destinationZipFilePath(){
    return path.join(__dirname, 'images.zip');
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      console.log(`Arquivo deletado: ${filePath}`);
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${filePath}:`, error);
    }
  }
}

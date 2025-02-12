import { IFileSystemService } from '@/domain/file-handling/IFileSystemService';
import fs from 'fs';
import path from 'path';

export class FileSystemService implements IFileSystemService  {
   createDirectoryIfNotExists(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  readFile(filePath: string): Buffer {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }
    return fs.readFileSync(filePath);
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
}

import { IFileSystemService } from '@/domain/file-handling/IFileSystemService';
import fs from 'fs';
import path from 'path';

export class FileSystemService implements IFileSystemService  {

  async deleteFolder(path: string): Promise<void> {
    
    if (fs.existsSync(path)) {
      fs.rm(path, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error('Error deleting folder:', err);
        } 
      });
    } else {
      console.log(`Folder ${path} not exists.`);
    }
  }
  
  createDirectoryIfNotExists(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  readFile(filePath: string): Promise<Buffer> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not exists: ${filePath}`);
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
      console.log(`File delete: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}

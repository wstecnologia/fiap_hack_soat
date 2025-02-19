export interface IFileSystemService {
  createDirectoryIfNotExists(directoryPath: string): void;
  readFile(filePath: string): Promise<Buffer>;
  joinPaths(...segments: string[]): string;
  outputFolder():string
  destinationZipFilePath():string
  deleteFile(filePath: string): Promise<void>
  deleteFolder(path:string):Promise<void>
}

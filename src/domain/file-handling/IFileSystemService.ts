export interface IFileSystemService {
  createDirectoryIfNotExists(directoryPath: string): void;
  readFile(filePath: string): Buffer;
  joinPaths(...segments: string[]): string;
  outputFolder():string
  destinationZipFilePath():string
}

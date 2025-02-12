export interface FileCompressionService {
  zipFolder(sourceFolder: string, zipFilePath: string): Promise<void>;
}
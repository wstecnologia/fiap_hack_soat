export interface ImageProcessingService {
  extractFrames(fileBuffer: Buffer, outputFolder: string, interval: number): Promise<void>;
}
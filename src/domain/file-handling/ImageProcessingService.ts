export interface ImageProcessingService {
  extractFrames(videoPath: string, outputFolder: string, interval: number): Promise<void>;
}
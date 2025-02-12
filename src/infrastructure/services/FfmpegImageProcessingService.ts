import { ImageProcessingService } from "@/domain/file-handling/ImageProcessingService";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export class FfmpegImageProcessingService implements ImageProcessingService {
  
  async extractFrames(videoPath: string, outputFolder: string, interval: number): Promise<void> {
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Arquivo de vídeo não encontrado: ${videoPath}`);
    }

    const duration = await this.getVideoDuration(videoPath);
    const tasks: Promise<void>[] = [];

    for (let currentTime = 0; currentTime < duration; currentTime += interval) {
      const outputPath = path.join(outputFolder, `frame_at_${currentTime}.jpg`);
      tasks.push(
        new Promise<void>((resolve, reject) => {
          ffmpeg(videoPath)
            .screenshots({
              timestamps: [currentTime],
              filename: path.basename(outputPath),
              folder: outputFolder,
              size: "1920x1080",
            })
            .on("end", resolve)
            .on("error", reject);
        })
      );
    }

    await Promise.all(tasks);
  }

  private getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration || 0);
        }
      });
    });
  }
}

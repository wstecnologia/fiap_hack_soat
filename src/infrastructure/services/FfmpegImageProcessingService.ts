import { ImageProcessingService } from "@/domain/file-handling/ImageProcessingService";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export class FfmpegImageProcessingService implements ImageProcessingService {
  
  async extractFrames(fileBuffer: Buffer, outputFolder: string, interval: number): Promise<void> {
    const tempVideoPath = path.join(outputFolder, `temp_video_${Date.now()}.mp4`);
    await fs.promises.writeFile(tempVideoPath, fileBuffer);

    const duration = await this.getVideoDuration(tempVideoPath);
    const tasks: Promise<void>[] = [];

    for (let currentTime = 0; currentTime < duration; currentTime += interval) {
      const outputPath = path.join(outputFolder, `frame_at_${currentTime}.jpg`);
      tasks.push(
        new Promise<void>((resolve, reject) => {
          ffmpeg(tempVideoPath)
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
    await fs.promises.unlink(tempVideoPath);
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

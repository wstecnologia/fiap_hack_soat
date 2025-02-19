import archiver from "archiver";
import fs from "fs";
import { FileCompressionService } from "../../domain/file-handling/FileCompressionService";

export class ArchiverCompressionService implements FileCompressionService {
  async zipFolder(sourceFolder: string, zipFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => resolve());
      output.on("end", () => console.log("File ZIP finished."));
      output.on("error", reject);

      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(sourceFolder, false);
      archive.finalize();
    });
  }
}

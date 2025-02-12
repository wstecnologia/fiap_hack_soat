import { FileCompressionService } from "@/domain/file-handling/FileCompressionService";
import archiver from "archiver";
import fs from "fs";

export class ArchiverCompressionService implements FileCompressionService {
  async zipFolder(sourceFolder: string, zipFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", resolve);
      archive.on("error", reject);

      archive.pipe(output);
      archive.directory(sourceFolder, false);
      archive.finalize();
    });
  }
}

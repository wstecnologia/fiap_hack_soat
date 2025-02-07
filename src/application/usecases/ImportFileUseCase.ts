import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';


export class ImportFileUseCase {
  private videoPath:string 
  private outputFolder = path.join(__dirname, 'Images');
  private destinationZipFilePath = path.join(__dirname, 'images.zip');
  
  constructor(){
    if (!fs.existsSync(this.outputFolder)) {
        fs.mkdirSync(this.outputFolder, { recursive: true });
    }
    
  }

  async execute(files:any):Promise<void>{
    console.log(files)
    this.videoPath = files.path 
    if (!fs.existsSync(files.path)) {
        throw new Error(`Arquivo de vídeo não encontrado: ${files.path}`);
    }

    const duration = await this.getVideoDuration(this.videoPath);
    const interval = 20; // Intervalo de 20 segundos
    const tasks: Promise<void>[] = [];

    for (let currentTime = 0; currentTime < duration; currentTime += interval) {
      console.log(`Processando frame: ${currentTime}s`);
      const outputPath = path.join(this.outputFolder, `frame_at_${currentTime}.jpg`);

      tasks.push(
        new Promise<void>((resolve, reject) => {
          ffmpeg(this.videoPath )
            .screenshots({
              timestamps: [currentTime],
              filename: path.basename(outputPath),
              folder: this.outputFolder,
              size: '1920x1080',
            })
            .on('end', resolve)
            .on('error', (err) => {
              console.error(`Erro ao processar frame em ${currentTime}s:`, err);
              reject(err);
            });
        })
      );
    }

    // Aguarda todas as promessas finalizarem
    await Promise.all(tasks);
    
  }

  private getVideoDuration = async (filePath: string): Promise<number> => {
      return new Promise((resolve, reject) => {
          ffmpeg.ffprobe(filePath, (err, metadata) => {
              if (err) {
                  reject(err);
              } else {
                  const duration = metadata.format.duration;
                  resolve(duration || 0);
              }
          });
      });
  };
}
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as archiver from 'archiver';

console.log("Processo iniciado:");

const videoPath = 'Marvel_DOTNET_CSHARP.mp4';
const outputFolder = path.join(__dirname, 'Images');
const destinationZipFilePath = path.join(__dirname, 'images.zip');

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Analisar a duração do vídeo
const getVideoDuration = async (filePath: string): Promise<number> => {
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

// Criar snapshots
const createSnapshots = async () => {
    try {
        const duration = await getVideoDuration(videoPath);
        const interval = 20; // Intervalo de 20 segundos

        for (let currentTime = 0; currentTime < duration; currentTime += interval) {
            console.log(`Processando frame: ${currentTime}s`);

            const outputPath = path.join(outputFolder, `frame_at_${currentTime}.jpg`);
            await new Promise<void>((resolve, reject) => {
                ffmpeg(videoPath)
                    .screenshots({
                        timestamps: [currentTime],
                        filename: path.basename(outputPath),
                        folder: outputFolder,
                        size: '1920x1080',
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        }
    } catch (error) {
        console.error('Erro ao processar snapshots:', error);
        throw error;
    }
};

// Compactar arquivos
const zipFolder = (sourceFolder: string, zipFilePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(sourceFolder, false);
        archive.finalize();
    });
};

const processVideo = async () => {
    try {
        await createSnapshots();
        await zipFolder(outputFolder, destinationZipFilePath);
        console.log("Processo finalizado.");
    } catch (error) {
        console.error("Erro durante o processo:", error);
    }
};

processVideo();

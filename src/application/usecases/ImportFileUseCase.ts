import { File } from '@/domain/entities/File';
import { DomainException } from '@/domain/exceptions/DomainException';
import { IFileSystemService } from '@/domain/file-handling/IFileSystemService';
import { IFileRepositorie } from '@/domain/repositories/IFileRepositorie';
import { Status } from '@/domain/shared/Status';
import fs from 'fs';
import { FileCompressionService } from '../../domain/file-handling/FileCompressionService';
import { ImageProcessingService } from '../../domain/file-handling/ImageProcessingService';
import { IMessageQueue } from '../../domain/queues/IMessageQueue';

export class ImportFileUseCase {  
  private outputFolder:string 
  private destinationZipFilePath:string 
  
  constructor(
    private imageProcessingService:ImageProcessingService,
    private compressionService:FileCompressionService,
    private rabbitMQPublisher:IMessageQueue,
    private fileSystemService: IFileSystemService,
    private fileRepositorie: IFileRepositorie
  ){
    this.outputFolder = this.fileSystemService.outputFolder()
    this.destinationZipFilePath = this.fileSystemService.destinationZipFilePath()
  }

  async execute(data:Input):Promise<void>{    
    console.log("Iniciando processamento...");
  
    try {  
      await this.imageProcessingService.extractFrames(data.file.path, this.outputFolder, 20);
      await this.compressionService.zipFolder(this.outputFolder, this.destinationZipFilePath);

      const arquivoBuffer = fs.readFileSync(this.destinationZipFilePath);

      const file: File = {
        url:"",
        user_id: data.user_id,
        duration: "",
        originalname:data.file.originalname,
        size:data.file.size,
        status: Status.PROCESSAMENTO_ANDAMENTO
      } 

      const dataRepositorieId = await this.fileRepositorie.insert(file)

      await this.rabbitMQPublisher.publish({
        file: arquivoBuffer,
        user_id: data.user_id,
        status: Status.PROCESSAMENTO_ANDAMENTO,
        id_db:dataRepositorieId
      });
     
      console.log("Processo finalizado.");
  } catch (error) {
      console.error("Erro durante o processo:", error);
      throw new DomainException(`Erro durante o processo`);  
  }
    
  }

}

type Input = {
  file:any
  user_id:string
}
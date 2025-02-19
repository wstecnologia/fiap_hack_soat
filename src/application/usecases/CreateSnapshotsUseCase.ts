import { File } from '../../domain/entities/File';
import { DomainException } from '../../domain/exceptions/DomainException';
import { FileCompressionService } from '../../domain/file-handling/FileCompressionService';
import { IFileSystemService } from '../../domain/file-handling/IFileSystemService';
import { ImageProcessingService } from '../../domain/file-handling/ImageProcessingService';
import { IMessageQueue } from '../../domain/queues/IMessageQueue';
import { IFileRepositorie } from '../../domain/repositories/IFileRepositorie';
import { Status } from '../../domain/shared/Status';
export class CreateSnapshotsUseCase {  
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

  execute(data:Input):Promise<void>{    
    console.log("Iniciando processamento...");

    return this.imageProcessingService.extractFrames(data.buffer, this.outputFolder, 20)
    .then(() => this.compressionService.zipFolder(this.outputFolder, this.destinationZipFilePath))
    .then(() => this.fileSystemService.readFile(this.destinationZipFilePath))
    .then((arquivoBuffer) => {
      //ImportS3.import(arquivoBuffer, "testeS3Fiap.zip")
      
      const file = File.create({
        url:"",
        user_id: data.user_id,
        duration: "",
        originalname:data.originalname,
        size:data.size,
        status: Status.PROCESSAMENTO_ANDAMENTO
      })

      return this.fileRepositorie.insert(file)
        .then((dataRepositorieId) => ({ arquivoBuffer, dataRepositorieId }));
    })
    .then(({ arquivoBuffer, dataRepositorieId }) => {
       
      this.rabbitMQPublisher.publish({
        exchange:'import_files',
        queue:'fiap_file_progress',
        routingKey:'fiap_file_progress',
        message: {
          file: arquivoBuffer,
          user_id: data.user_id,
          email: data.email,
          status: Status.PROCESSAMENTO_ANDAMENTO,
          id_db: dataRepositorieId
        }
      })

      this.rabbitMQPublisher.publish({
        exchange:'notification',
        queue:'file_progress',
        routingKey:'file_progress',
        message: {
          email: data.email,
          subject: "Processing file",
          message: "File processing please wait",          
        }
      })
      
      this.fileSystemService.deleteFile
      return this.fileSystemService.deleteFile(this.destinationZipFilePath);
    })
    .then(() => console.log("Processo finalizado."))
    .catch((error) => {
      console.error("Erro durante o processo:", error);
      this.rabbitMQPublisher.publish({
        exchange:'notification',
        queue:'file_progress',
        routingKey:'file_progress',
        message: {
          email: data.email,
          subject: "Processing file",
          message: "Process failed",          
        }
      })
      throw new DomainException(`Error during process: ${error instanceof Error ? error.message : error}`);
    });
}  

}

type Input = {  
  user_id:string 
  email:string 
  originalname:string
  mimetype:string
  size:number
  buffer: Buffer
}
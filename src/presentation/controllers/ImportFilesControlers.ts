import { ImportFileUseCase } from "@/application/usecases/ImportFileUseCase";
import { FileSystemService } from "@/infrastructure/config/FileSystemService";
import { RabbitMQFactory } from "@/infrastructure/queue/RabbitMqFactory";
import { ArchiverCompressionService } from "@/infrastructure/services/ArchiverCompressionService";
import { FfmpegImageProcessingService } from "@/infrastructure/services/FfmpegImageProcessingService";

export class ImportFilesControlers {
  private importFilesUseCase: ImportFileUseCase
  constructor(){
    this.importFilesUseCase = new ImportFileUseCase(
      new FfmpegImageProcessingService(),
      new ArchiverCompressionService(),
      new RabbitMQFactory('import_files','fiap_file','fiap_file'),
      new FileSystemService()
    )
  }

  async import(req):Promise<void>{    
    const user_id = req.auth.sub

    const input = {
      user_id,
      file:req.file
    }
    
    return await this.importFilesUseCase.execute(input)
  }
}
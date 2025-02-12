import { ImportFileUseCase } from "@/application/usecases/ImportFileUseCase";
import { ListStatusFilesUsersUseCase } from "@/application/usecases/ListStatusFilesUsersUseCase";
import { FileSystemService } from "@/infrastructure/config/FileSystemService";
import { RabbitMQFactory } from "@/infrastructure/queue/RabbitMqFactory";
import { FilesMongoRepositorie } from "@/infrastructure/repository/FilesMongoRepositorie";
import { ArchiverCompressionService } from "@/infrastructure/services/ArchiverCompressionService";
import { FfmpegImageProcessingService } from "@/infrastructure/services/FfmpegImageProcessingService";

export class FilesControllers {
  private importFilesUseCase: ImportFileUseCase
  private listStatusFilesUsersUseCase: ListStatusFilesUsersUseCase
  constructor(){
    this.importFilesUseCase = new ImportFileUseCase(
      new FfmpegImageProcessingService(),
      new ArchiverCompressionService(),
      new RabbitMQFactory('import_files','fiap_file_progress','fiap_file_progress'),
      new FileSystemService(),
      new FilesMongoRepositorie()
    )
    this.listStatusFilesUsersUseCase = new ListStatusFilesUsersUseCase(new FilesMongoRepositorie())
  }

  async import(req):Promise<void>{    
    const user_id = req.auth.sub

    const input = {
      user_id,
      file:req.file
    }
    
    return await this.importFilesUseCase.execute(input)
  }

  async getListStatusFilesUsers(req){
    //query: { page: '1', limit: '10' }
    const filter = {
      page: Number(req.query.page) || 1,
      limit:Number(req.query.limit) || 10
    }
    return this.listStatusFilesUsersUseCase.execute(filter)

  }
}
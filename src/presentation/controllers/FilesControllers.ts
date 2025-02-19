import { CreateSnapshotsUseCase } from "../../application/usecases/CreateSnapshotsUseCase";
import { ListStatusFilesUsersUseCase } from "../../application/usecases/ListStatusFilesUsersUseCase";
import { UpdateStatusFileUseCase } from "../../application/usecases/UpdateStatusFileUseCase";
import { FileSystemService } from "../../infrastructure/config/FileSystemService";
import { RabbitMQFactory } from "../../infrastructure/queue/RabbitMqFactory";
import { FilesMongoRepositorie } from "../../infrastructure/repository/FilesMongoRepositorie";
import { ArchiverCompressionService } from "../../infrastructure/services/ArchiverCompressionService";
import { FfmpegImageProcessingService } from "../../infrastructure/services/FfmpegImageProcessingService";

export class FilesControllers {
  private createSnapshotsUseCase: CreateSnapshotsUseCase
  private listStatusFilesUsersUseCase: ListStatusFilesUsersUseCase
  private updateStatusUseCase: UpdateStatusFileUseCase
  constructor(){
    this.createSnapshotsUseCase = new CreateSnapshotsUseCase(
      new FfmpegImageProcessingService(),
      new ArchiverCompressionService(),
      new RabbitMQFactory(),
      new FileSystemService(),
      new FilesMongoRepositorie()
    )
    this.listStatusFilesUsersUseCase = new ListStatusFilesUsersUseCase(new FilesMongoRepositorie())
    this.updateStatusUseCase = new UpdateStatusFileUseCase(new FilesMongoRepositorie())
  }

   import(req):Promise<void>{    
    const user_id = req.auth.sub
   
    const input = {
      user_id,
      originalname:req.file.originalname,
      email:req.auth.email,
      mimetype:req.file.mimetype,
      size:Number(req.file.size),
      buffer:req.file.buffer
    }
    
    return  this.createSnapshotsUseCase.execute(input)
  }

  async getListStatusFilesUsers(req){
    //query: { page: '1', limit: '10' }
    const filter = {
      page: Number(req.query.page) || 1,
      limit:Number(req.query.limit) || 10
    }
    return this.listStatusFilesUsersUseCase.execute(filter)

  }

  async updateStatus(req){
    const {id, status, url} = req.query

    const data = {
      id,
      status,
      url
    }
    this.updateStatusUseCase.execute(data)   
  }
}

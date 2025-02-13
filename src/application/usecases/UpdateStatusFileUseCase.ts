import { File } from "@/domain/entities/File";
import { IFileRepositorie } from "@/domain/repositories/IFileRepositorie";

export class UpdateStatusFileUseCase {
  constructor(private fileRepositorie:IFileRepositorie){}

  async execute(data:Input):Promise<void>{

    const file = await this.fileRepositorie.getFile(data.id)

    const inputFile:File = {
      status:data.status,
      url:data.url,
      id:data.id,
      originalname:file.originalname, 
      duration:file.duration, 
      size:file.size, 
      user_id:file.user_id
    }

    await this.fileRepositorie.update(inputFile) 
  }

}

type Input = {
  id:string
  status:string
  url:string
}
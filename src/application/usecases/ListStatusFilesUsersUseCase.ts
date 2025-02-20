import { DomainException } from "../../domain/exceptions/DomainException";
import { IFileRepositorie } from "../../domain/repositories/IFileRepositorie";
import { FileResponseDTO } from "../dto/FileResponseDTO";
import { PaginatedResponseDTO } from "../dto/PaginatedResponseDTO";

export class ListStatusFilesUsersUseCase {
  constructor(private fileRepositorie: IFileRepositorie){}

  async execute(filter:Input):Promise<PaginatedResponseDTO<FileResponseDTO>>{
    try {
        return await this.fileRepositorie.getFilesUses(filter)
    } catch (error) {
      console.error(error)
      throw new DomainException("Error in generate list files")
    }
  }
}

type Input = {
  userId:string
  page:number
  limit:number
}
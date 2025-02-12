import { FileResponseDTO } from "@/application/dto/FileResponseDTO"
import { PaginatedResponseDTO } from "@/application/dto/PaginatedResponseDTO"
import { File } from "../entities/File"

export interface IFileRepositorie {
  insert(file:File):Promise<string>
  getFilesUses(filter:Input):Promise<PaginatedResponseDTO<FileResponseDTO>> 
}

type Input = {
  page:number
  limit:number
}
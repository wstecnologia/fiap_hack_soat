import { FileResponseDTO } from "@/application/dto/FileResponseDTO"
import { PaginatedResponseDTO } from "@/application/dto/PaginatedResponseDTO"
import { File } from "../entities/File"

export interface IFileRepositorie {
  insert(file:File):Promise<string>
  getFilesUses(filter:Input):Promise<PaginatedResponseDTO<FileResponseDTO>> 
  update(file:File):Promise<void>
  getFile(id:string): Promise<File>
}

type Input = {
  userId:string
  page:number
  limit:number
}
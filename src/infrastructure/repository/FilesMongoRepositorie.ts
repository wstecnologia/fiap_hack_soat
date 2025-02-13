import { FileResponseDTO } from "@/application/dto/FileResponseDTO";
import { PaginatedResponseDTO } from "@/application/dto/PaginatedResponseDTO";
import { File } from "@/domain/entities/File";
import { IFileRepositorie } from "@/domain/repositories/IFileRepositorie";
import { PrismaClient } from "@prisma/client";
import { InfrastructureException } from "../exceptions/InfrastructureException";

export class FilesMongoRepositorie implements IFileRepositorie {
  private _prisma:PrismaClient
  constructor(){
    this._prisma = new  PrismaClient()
  }

async update(file: File): Promise<void> {
  try {
    try {
      console.log(file)
      
        await this._prisma.files.update({
            data:{
              status:file.status,        
              link_file:file.url
            },
            where:{
              id:file.id
            }
          })
    } catch (error) {
      throw new InfrastructureException("An error occurred updated file");
    }finally {
      await this._prisma.$disconnect();
    }
    
    
  } catch (error) {
    console.error(error)
    throw new InfrastructureException("An error occurred update file");
  } finally {
    await this._prisma.$disconnect();
  }
}

async insert(file: File): Promise<string> {
    try {
    
  
      const fileCreated =  await this._prisma.files.create({
          data:{        
            status: file.status,
            user_id: file.user_id,
            link_file: file.url,

          }
        })
      return fileCreated.id
  } catch (error) {
    console.error(error)
    throw new InfrastructureException("An error occurred created file");
  }finally {
    await this._prisma.$disconnect();
  }
}

async getFilesUses(filter:Input): Promise<PaginatedResponseDTO<FileResponseDTO>> {
  try {
    const totalItems = await this._prisma.files.count()
    const lstFiles =  await this._prisma.files.findMany({    
      take:Number(filter.limit),
      skip:(Number(filter.page) - 1) * Number(filter.limit)
    })

    const filesDto = lstFiles.map(file => new FileResponseDTO(file))

    return new PaginatedResponseDTO(filesDto, totalItems, filter.page, filter.limit)
    
  } catch (error) {
    console.error(error)
    throw new InfrastructureException("An error occurred list all files");
  } finally {
    await this._prisma.$disconnect();
  }
}


async getFile(id:string): Promise<File> {    
  try {
    const file =  await this._prisma.files.findMany({
      where:{
        id
      }
    })

    const returnFile:File = {
      id: file[0].id,
      url:file[0].link_file,
      user_id:file[0].user_id,
      status: file[0].status,
      originalname:"", 
      duration:"",
      size:0 
    }

    return returnFile
    
  } catch (error) {
    console.error(error)
    throw new InfrastructureException("An error occurred updated file");
  }finally {
    await this._prisma.$disconnect();
  }

}

}

type Input = {
  page:number
  limit:number
}
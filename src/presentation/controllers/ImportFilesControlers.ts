import { ImportFileUseCase } from "@/application/usecases/ImportFileUseCase";

export class ImportFilesControlers {
  private importFilesUseCase: ImportFileUseCase
  constructor(){
    this.importFilesUseCase = new ImportFileUseCase()
  }

  async import(req, res):Promise<any>{
    
    return await this.importFilesUseCase.execute(req.file)
  }
}
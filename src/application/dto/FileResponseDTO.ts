export class FileResponseDTO {
  user_id: string;
  status: string;
  id: string;
  link_file: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.user_id = data.user_id;
    this.status = data.status;
    this.id = data.id;
    this.link_file = data.link_file;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

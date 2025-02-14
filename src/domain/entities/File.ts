type InputFile = {
  id?:string
  originalname:string
  duration:string
  size:number
  user_id:string
  url:string
  status:string
}
export class File { 
  constructor(
    private _id:string,
    private _originalname:string,
    private _duration:string,
    private _size:number,
    private _user_id:string,
    private _url:string,
    private _status:string
  ){

  }

  static create(input: InputFile){
    return new File(
      input.id || "",
      input.originalname,
      input.duration,
      input.size,
      input.user_id,
      input.url,
      input.status
    )
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._originalname;
  }

  get duration(): string {
    return this._duration;
  }

  get size(): number {
    return this._size;
  }

  get userId(): string {
    return this._user_id;
  }

  get url(): string {
    return this._url;
  }

  get status(): string {
    return this._status;
  } 
}
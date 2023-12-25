export class BaseResponseModel<T> {
  public readonly header!: BaseHeaderResponseModel;
  public readonly payload!: T;

  constructor(data: Partial<BaseResponseModel<T>>) {
    Object.assign(this, data);
  }
}

export class BaseHeaderResponseModel {
  public readonly status!: number;
  public readonly code!: string;
  public readonly message!: string;
  public readonly timestamp!: string;


  constructor(data: Partial<BaseHeaderResponseModel>) {
    Object.assign(this, data);
  }
}

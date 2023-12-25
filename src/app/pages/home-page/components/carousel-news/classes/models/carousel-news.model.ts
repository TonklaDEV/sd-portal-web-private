export class CarouselNewsModel {
  public image!: string;
  public title!: string;
  public description!: string;

  constructor(model: Partial<CarouselNewsModel>) {
    Object.assign(this, model);
  }
}

export class DashboardJobResponseModel {
  public projectId!: string;
  public projectName!: string;
  public projectDescription?: string;

  constructor(model: Partial<DashboardJobResponseModel>) {
    Object.assign(this, model);
  }
}

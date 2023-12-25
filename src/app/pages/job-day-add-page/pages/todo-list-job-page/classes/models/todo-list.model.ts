export class ProjectTodoListItemResponseModel {
  public projectId!: string;
  public groupId!: string;
  public groupName!: string;
  public positionOrderGroup!: number;
  public child!: ProjectTodoListItemChildResponseModel;

  constructor(dto: Partial<ProjectTodoListItemResponseModel>) {
    Object.assign(this, dto);
  }
}

export class ProjectTodoListItemChildResponseModel {
  public childId!: string;
  public items!: Array<TodoListItemChildResponseModel>;

  constructor(dto: Partial<ProjectTodoListItemChildResponseModel>) {
    Object.assign(this, dto);
  }
}

export class TodoListItemChildResponseModel {
  public itemId!: string;
  public itemName!: string;
  public itemDescription?: string;
  public tags?: Array<string>;
  public positionOrderItem!: number;

  constructor(dto: Partial<TodoListItemChildResponseModel>) {
    Object.assign(this, dto);
  }
}

export class TodoListModel {
  public todoId!: number;
  public title!: string;
  public description?: string;
  public users?: Array<TodoUserModel>;
  public startDate?: string;
  public endDate?: string;
  public tags?: Array<string>;
  public projectCheck?: TodoCheckProjectModel;
  public notification?: boolean;

  constructor(dto: Partial<TodoListModel>) {
    Object.assign(this, dto);
  }
}

export class TodoUserModel {
  public image!: string;
  public name!: string;
  public email!: string;

  constructor(dto: Partial<TodoUserModel>) {
    Object.assign(this, dto);
  }
}

export class TodoCheckProjectModel {
  public projectTotal!: number;
  public projectDone!: number;

  constructor(dto: Partial<TodoCheckProjectModel>) {
    Object.assign(this, dto);
  }
}

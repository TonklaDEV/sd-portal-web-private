import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Observable, Subscription, lastValueFrom } from 'rxjs';

import { ProjectTodoListItemResponseModel, TodoCheckProjectModel, TodoListModel, TodoUserModel } from './classes/models/todo-list.model';

import { TodoListService } from '../../services/todo-list/todo-list.service';

import { ModalItemCardDetailComponent } from '../../components/modal-item-card-detail/modal-item-card-detail.component';

import { DeleteModalComponent } from '../../../../components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-todo-list-job-page',
  templateUrl: './todo-list-job-page.component.html',
  styleUrls: ['./todo-list-job-page.component.scss'],
})
export class TodoListJobPageComponent implements OnInit, OnDestroy {
  private projectId!: string;

  private activatedRouteSubscription!: Subscription;
  private deleteProjectSubscription?: Subscription;
  private deleteCardSubscription?: Subscription;

  public isFavoriteProject: boolean = false;

  public datalist!: Array<ProjectTodoListItemResponseModel>;

  // Delete - Don't use this variable when API is ready to use
  public mockTodoListData: Array<any> = new Array<any>(
    {
      projectId: 'SD0001',
      projectName: 'SD-PORTAL',
      todoGroupId: 'T0001',
      todoGroupName: 'รายการที่ต้องทำ',
      child: {
        childId: 'TC0001',
        todoListItems: new Array<TodoListModel>(
          new TodoListModel({
            todoId: 1,
            title: 'UX/UI Design',
            description: 'Design the user interface for the new website',
            startDate: '03 มี.ค. 64',
            endDate: '06 มี.ค. 64',
            users: new Array<TodoUserModel>(
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Ratchapol Thongta',
                email: 'ratchapol.tumrp@gmail.com',
              }),
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Wow Ratchapol',
                email: 'ratchapol.tumrp@gmail.com',
              }),
            ),
            tags: new Array<string>('Design', 'UX/UI'),
          }),
          new TodoListModel({
            todoId: 2,
            title: 'UX/UI Design',
            description: 'Design the user interface for the new website',
            users: new Array<TodoUserModel>(
              {
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Ratchapol Thongta',
                email: 'ratchapol.tumrp@gmail.com',
              },
            ),
            tags: new Array<string>('Design', 'UX/UI'),
          }),
          new TodoListModel({
            todoId: 1,
            title: 'UX/UI Design',
            description: 'Design the user interface for the new website',
            startDate: '03 มี.ค. 64',
            endDate: '06 มี.ค. 64',
            users: new Array<TodoUserModel>(
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Ratchapol Thongta',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Wow Ratchapol',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
            ),
            tags: new Array<string>('Design', 'UX/UI'),
          }),
        ),
      },
    },
    {
      projectId: 'SD0001',
      projectName: 'SD-PORTAL',
      todoGroupId: 'T0002',
      todoGroupName: 'กำลังดำเนินการ',
      child: {
        childId: 'TC0002',
        todoListItems: new Array<TodoListModel>(
          new TodoListModel({
            todoId: 3,
            title: 'Database Design',
            description: 'Design the database for the new website',
            startDate: '03 มี.ค. 64',
            endDate: '06 มี.ค. 64',
            users: new Array<TodoUserModel>(
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Ratchapol Thongta',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Wow Ratchapol',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Test Ratchapol',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
            ),
            tags: new Array<string>('Design', 'UX/UI'),
            projectCheck: new TodoCheckProjectModel({
              projectTotal: 3,
              projectDone: 1,
            }),
            notification: true,
          }),
        ),
      },
    },
    {
      projectId: 'SD0001',
      projectName: 'SD-PORTAL',
      todoGroupId: 'T0003',
      todoGroupName: 'เสร็จสิ้น',
      child: {
        childId: 'TC0003',
        todoListItems: new Array<TodoListModel>(
          new TodoListModel({
            todoId: 4,
            title: 'Sequence diagram',
            description: 'Design the sequence diagram for the new website',
            users: new Array<TodoUserModel>(
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Ratchapol Thongta',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
              new TodoUserModel({
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                name: 'Wow Ratchapol',
                email: 'Ratchapol.tumrp@gmail.com',
              }),
            ),
            tags: new Array<string>('Design', 'UX/UI'),
          }),
        ),
      },
    },
    {
      projectId: 'SD0001',
      projectName: 'SD-PORTAL',
      todoGroupId: 'T0004',
      todoGroupName: 'ทดสอบ',
      child: {
        childId: 'TC0004',
        todoListItems: new Array<TodoListModel>(),
      },
    },
    {
      projectId: 'SD0001',
      projectName: 'SD-PORTAL',
      todoGroupId: 'T0005',
      todoGroupName: 'ยกเลิก',
      child: {
        childId: 'TC0005',
        todoListItems: new Array<TodoListModel>(),
      },
    }
  );

  @ViewChild('itemCardDetail', { read: ModalItemCardDetailComponent })
  private itemCardDetail?: ModalItemCardDetailComponent;

  @ViewChild('delete', { read: DeleteModalComponent })
  private delete?: DeleteModalComponent;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly location: Location, private readonly todoListService: TodoListService) {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.projectId = params['id'] as string;
    });
  }

  public async ngOnInit(): Promise<void> {
    await this.initData();
  }

  public ngOnDestroy(): void {
    this.activatedRouteSubscription.unsubscribe();

    this.deleteProjectSubscription?.unsubscribe();
    this.deleteCardSubscription?.unsubscribe();
  }

  private async initData(): Promise<void> {
    await this.initProjectData();
    await this.initProjectFavoriteIcon();
  }

  private async initProjectData(): Promise<void> {
    const { payload: items } = await lastValueFrom(this.todoListService.getProjectByProjectId(this.projectId));

    if (items !== undefined && items !== null) {
      this.datalist = items;
    }
  }

  private async initProjectFavoriteIcon(): Promise<void> {
    const { payload: check } = await lastValueFrom(this.todoListService.checkFavoriteProject('U00001', this.projectId));

    if (check !== undefined && check !== null) {
      this.isFavoriteProject = check;
    } else {
      this.isFavoriteProject = false;
    }
  }

  public changePositionGroupTodoList(event: CdkDragDrop<Array<any>>): void {
    moveItemInArray(this.mockTodoListData, event.previousIndex, event.currentIndex);
  }

  public drop(event: CdkDragDrop<Array<TodoListModel>>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public getItemsListIdsConnectedTo(todoGroupId: string): Array<string> {
    const result: Array<string> = new Array<string>();

    this.mockTodoListData.forEach((item: any): void => {
      if (item.todoGroupId !== todoGroupId) {
        result.push(item.child.childId);
      }
    });

    return result;
  }

  public async onAddFavoriteProject(): Promise<void> {
    const { payload: check } = await lastValueFrom(this.todoListService.checkFavoriteProject('U00001', this.projectId));

    if (check !== undefined && check !== null && check === true) {
      await this.onRemoveFavoriteProject();
    } else {
      const { payload: result } = await lastValueFrom(this.todoListService.addFavoriteProject('U00001', this.projectId));

      if (result !== undefined && result !== null) {
        this.isFavoriteProject = true;
      }
    }
  }

  public async onRemoveFavoriteProject(): Promise<void> {
    const { payload } = await lastValueFrom(this.todoListService.deleteFavoriteProject('U00001', this.projectId));

    if (payload !== undefined && payload !== null) {
      this.isFavoriteProject = false;
    }
  }

  public showNumberOtherUsers(item: TodoListModel): boolean {
    if (item.users !== undefined && item.users !== null) {
      return item.users.length > 2;
    } else {
      return false;
    }
  }

  public showNumberOfOtherUsers(item: TodoListModel): number {
    if (item.users !== undefined && item.users !== null) {
      return item.users.length - 2;
    } else {
      return 0;
    }
  }

  public onOpenDialogItem(itemId: string): void {
    if (this.itemCardDetail !== undefined) {
      this.itemCardDetail.onOpen(itemId);
    }
  }

  public onOpenDialogDeleteProject(): void {
    if (this.delete !== undefined) {
      const modal: Observable<string> = this.delete.onOpen(this.projectId, '');

      this.deleteProjectSubscription = modal.subscribe((result: string): void => {
        console.log('result-1: ', result);
      });
    }
  }

  public onOpenDialogDeleteCard(itemId: string, cardName: string): void {
    if (this.delete !== undefined) {
      const modal: Observable<string> = this.delete.onOpen(itemId, `คุณต้องการลบรายการ ${cardName} ใช่หรือไม่`);

      this.deleteCardSubscription = modal.subscribe( async (result: string): Promise<void> => {
        if (result !== '') {
          const { payload } = await lastValueFrom(this.todoListService.deleteCardItem(result));
        }
      });
    }
  }
}

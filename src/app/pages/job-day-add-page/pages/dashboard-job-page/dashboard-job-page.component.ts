import { Component, OnInit } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { DashboardJobResponseModel } from './classes/models/dashboard-job-list.model';

import { TodoListService } from '../../services/todo-list/todo-list.service';

@Component({
  selector: 'app-dashboard-job-page',
  templateUrl: './dashboard-job-page.component.html',
  styleUrls: ['./dashboard-job-page.component.scss'],
})
export class DashboardJobPageComponent implements OnInit {
  public projects!: Array<DashboardJobResponseModel>;
  public projectsFavorite!: Array<DashboardJobResponseModel>;

  // Delete - Don't use this value, it's just for example
  private readonly mockUserId: string = 'U00001';

  constructor(private readonly todoListService: TodoListService) {}

  public async ngOnInit(): Promise<void> {
    await this.initData();
  }

  public async initData(): Promise<void> {
    await this.initProjects();
    await this.initFavoriteProjects();
  }

  private async initProjects(): Promise<void> {
    const { payload: projects } = await lastValueFrom(this.todoListService.getProjectList());

    this.projects = projects;
  }

  private async initFavoriteProjects(): Promise<void> {
    const { payload: projectsFavorite } = await lastValueFrom(this.todoListService.getFavoriteProjectList('U00001'));

    this.projectsFavorite = projectsFavorite;
  }
}

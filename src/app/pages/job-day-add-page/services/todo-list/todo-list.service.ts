import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BaseResponseModel } from '@shared/classes/models/base-response.model';

import { Observable } from 'rxjs';

@Injectable()
export class TodoListService {
  constructor(private readonly http: HttpClient) {}

  public getProjectList(): Observable<BaseResponseModel<any>> {
    return this.http.get<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/get-project-list');
  }

  public checkFavoriteProject(userId: string, projectId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('user-id', userId).append('project-id', projectId);

    return this.http.get<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/check-favorite-project', {
      params: params,
    });
  }

  public getFavoriteProjectList(userId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('user-id', userId);

    return this.http.get<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/get-favorite-project-list', {
      params: params,
    });
  }

  public getProjectByProjectId(projectId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('project-id', projectId);

    return this.http.get<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/get-project-item-by-project-id', {
      params: params,
    });
  }

  public addFavoriteProject(userId: string, projectId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('user-id', userId).append('project-id', projectId);

    return this.http.post<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/add-favorite-project', null, {
      params: params,
    });
  }

  public deleteProjectItem(projectId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('project-id', projectId);

    return this.http.delete<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/delete-project-item', {
      params: params,
    });
  }

  public deleteCardItem(itemId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('item-id', itemId);

    return this.http.delete<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/delete-card-item', {
      params: params,
    });
  }

  public deleteFavoriteProject(userId: string, projectId: string): Observable<BaseResponseModel<any>> {
    const params: HttpParams = new HttpParams().append('user-id', userId).append('project-id', projectId);

    return this.http.delete<BaseResponseModel<any>>('http://localhost:8080/sd-data-portal-service/todo-list/delete-favorite-project', {
      params: params,
    });
  }
}

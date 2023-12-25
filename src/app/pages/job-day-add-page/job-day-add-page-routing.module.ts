import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import { SystemLayoutComponent } from '@layout/system-layout/system-layout.component';

import { DashboardJobPageComponent } from './pages/dashboard-job-page/dashboard-job-page.component';
import { TodoListJobPageComponent } from './pages/todo-list-job-page/todo-list-job-page.component';

const routes: Routes = new Array<Route>(
  {
    path: 'job-day-add',
    component: SystemLayoutComponent,
    children: new Array<Route>(
      {
        path: 'dashboard-job',
        component: DashboardJobPageComponent,
      },
      {
        path: 'todo-list-job/:id',
        component: TodoListJobPageComponent,
      },
    ),
  },
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobDayAddPageRoutingModule {}

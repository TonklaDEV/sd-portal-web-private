import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import { SystemLayoutComponent } from './layouts/system-layout/system-layout.component';

import { AuthGuard } from './auth-guard/auth.guard';
import { FtrOf1PageComponent } from './pages/ftr-of1-page/ftr-of1-page.component';
import { FtrOj1PageComponent } from './pages/ftr-oj1-page/ftr-oj1-page.component';
import { FtrSv1PageComponent } from './pages/ftr-sv1-page/ftr-sv1-page.component';
import { ManageCoursePageComponent } from './pages/manage-course-page/manage-course-page.component';
import { ManageUserPageComponent } from './pages/manage-user-page/manage-user-page.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { SignaturePageComponent } from './pages/signature-page/signature-page.component';
const routes: Routes = new Array<Route>(
  {
    path: 'sign-in',
    component: SignInPageComponent,
  },
  {
    path: 'pccth',
    canActivate: [AuthGuard],
    component: SystemLayoutComponent,
    children: new Array<Route>(
      {
        path: '',
        // component: HomePageComponent,
        redirectTo: 'detail'
      },
      // {
      //   path: 'news',
      //   component: NewsPageComponent,
      // },
      // {
      //   path: 'calender',
      //   component: CalenderPageComponent,
      // },
      // {
      //   path: 'dashboard',
      //   component: DashboardPageComponent,
      // },
      {
        path: 'form',
        component: FtrOf1PageComponent,
      },
      {
        path: 'detail',
        component: FtrOj1PageComponent,
      },
      {
        path: 'budget',
        component: FtrSv1PageComponent,
      },
      {
        path: 'signature',
        component: SignaturePageComponent,
      },
      {
        path: 'manage-course',
        component: ManageCoursePageComponent,
      },
      {
        path: 'manage-user',
        component: ManageUserPageComponent,
      },
      // {
      //   path: 'job-day-view',
      //   component: JobDayViewPageComponent,
      // },
      // {
      //   path: 'management-news',
      //   component: ManagementNewsPageComponent,
      // },
      // {
      //   path: 'management-dashboard',
      //   component: ManagementDashboardPageComponent,
      // },
      // {
      //   path: 'management-role',
      //   component: ManagementRolePageComponent,
      // },
      // {
      //   path: 'news-detail',
      //   component: NewsDetailPageComponent,
      // },
      {
        // Redirects all paths that are not matching to the 'sign-in' route/path
        path: '**',
        redirectTo: 'detail',
        pathMatch: 'full'
      }
    ),
  },
  {
    // Redirects all paths that are not matching to the 'sign-in' route/path
    path: '**',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  }

);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard], // ตรวจสอบว่าคุณได้ระบุ Provider สำหรับ AuthGuard ที่นี่
})
export class AppRoutingModule {}

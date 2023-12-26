import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { JobDayAddPageModule } from './job-day-add-page/job-day-add-page.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FtrOf1Service } from '../api-services/ftr-of1.service';
import { SharedModule } from '../shared/shared.module';
import { CalenderPageComponent } from './calender-page/calender-page.component';
import { CalendarComponentsComponent } from './calender-page/components/calendar-components/calendar-components.component';
import { CalendarTableComponent } from './calender-page/components/calendar-table/calendar-table.component';
import { InformationProjectUserComponent } from './dashboard-page/components/information-project-user/information-project-user.component';
import { InformationUserComponent } from './dashboard-page/components/information-user/information-user.component';
import { TreemapChartComponent } from './dashboard-page/components/treemap-chart/treemap-chart.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { FtrOf1PageComponent } from './ftr-of1-page/ftr-of1-page.component';
import { FtrOj1PageComponent } from './ftr-oj1-page/ftr-oj1-page.component';
import { SafePipe } from './ftr-oj1-page/safe.pipe';
import { FtrSv1PageComponent } from './ftr-sv1-page/ftr-sv1-page.component';
import { CarouselNewsComponent } from './home-page/components/carousel-news/carousel-news.component';
import { ListCardPeopleComponent } from './home-page/components/list-card-people/list-card-people.component';
import { ListCardSystemComponent } from './home-page/components/list-card-system/list-card-system.component';
import { ListDescriptionComponent } from './home-page/components/list-description/list-description.component';
import { HomePageComponent } from './home-page/home-page.component';
import { JobDayViewPageComponent } from './job-day-view-page/job-day-view-page.component';
import { ManageCoursePageComponent } from './manage-course-page/manage-course-page.component';
import { ManageUserPageComponent } from './manage-user-page/manage-user-page.component';
import { ManagementDashboardPageComponent } from './management-dashboard-page/management-dashboard-page.component';
import { ManagementNewsPageComponent } from './management-news-page/management-news-page.component';
import { ManagementRolePageComponent } from './management-role-page/management-role-page.component';
import { NewsDetailPageComponent } from './news-detail-page/news-detail-page.component';
import { NewsTableComponent } from './news-page/components/news-table/news-table.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { SignaturePageComponent } from './signature-page/signature-page.component';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    HomePageComponent,
    CarouselNewsComponent,
    ListCardSystemComponent,
    ListDescriptionComponent,
    ListCardPeopleComponent,

    NewsPageComponent,

    CalenderPageComponent,
    CalendarTableComponent,

    DashboardPageComponent,
    InformationUserComponent,
    InformationProjectUserComponent,

    JobDayViewPageComponent,

    ManagementNewsPageComponent,
    ManagementDashboardPageComponent,
    ManagementRolePageComponent,
    CalendarComponentsComponent,
    NewsTableComponent,
    TreemapChartComponent,
    NewsDetailPageComponent,
    FtrOf1PageComponent,
    FtrOj1PageComponent,
    FtrSv1PageComponent,
    SignInPageComponent,
    SignaturePageComponent,
    ManageUserPageComponent,
    ManageCoursePageComponent,
    SafePipe,
  ],
  imports: [
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatNativeDateModule,
    JobDayAddPageModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatExpansionModule,
  ],
  providers: [FtrOf1Service],
})
export class PageModule {}

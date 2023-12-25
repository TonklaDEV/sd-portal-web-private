import { NgModule } from "@angular/core";

import { SharedModule } from "@shared/shared.module";

import { LayoutModule } from "@layout/layout.module";

import { JobDayAddPageRoutingModule } from "./job-day-add-page-routing.module";

import { DashboardJobPageComponent } from "./pages/dashboard-job-page/dashboard-job-page.component";
import { TodoListJobPageComponent } from "./pages/todo-list-job-page/todo-list-job-page.component";
import { ModalItemCardDetailComponent } from "./components/modal-item-card-detail/modal-item-card-detail.component";

import { TodoListService } from "./services/todo-list/todo-list.service";

import { PccSdPortalComponentModule } from "../../components/pcc-sd-portal-component.module";


@NgModule({
  declarations: [DashboardJobPageComponent, TodoListJobPageComponent, ModalItemCardDetailComponent],
  imports: [SharedModule, LayoutModule, PccSdPortalComponentModule, JobDayAddPageRoutingModule],
  providers: [TodoListService],
  exports: [JobDayAddPageRoutingModule],
})
export class JobDayAddPageModule {}

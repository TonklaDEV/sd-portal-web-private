import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { NavigationAsideComponent } from './navigation-aside/navigation-aside.component';
import { HeaderSystemComponent } from './header-system/header-system.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
@NgModule({
  declarations: [
    NavigationAsideComponent,
    HeaderSystemComponent,
    DeleteModalComponent,
  ],
  imports: [SharedModule, 
    SweetAlert2Module.forRoot()],
  exports: [
    NavigationAsideComponent,
    HeaderSystemComponent,
    DeleteModalComponent,
  ],
})
export class PccSdPortalComponentModule {}

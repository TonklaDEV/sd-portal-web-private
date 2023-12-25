import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { NavigationAsideComponent } from './navigation-aside/navigation-aside.component';
import { HeaderSystemComponent } from './header-system/header-system.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@NgModule({
  declarations: [
    NavigationAsideComponent,
    HeaderSystemComponent,
    DeleteModalComponent,
  ],
  imports: [SharedModule],
  exports: [
    NavigationAsideComponent,
    HeaderSystemComponent,
    DeleteModalComponent,
  ],
})
export class PccSdPortalComponentModule {}

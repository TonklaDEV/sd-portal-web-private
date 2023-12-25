import { NgModule } from '@angular/core';

import { SystemLayoutComponent } from './system-layout/system-layout.component';

import { SharedModule } from '../shared/shared.module';
import { PccSdPortalComponentModule } from '../components/pcc-sd-portal-component.module';

@NgModule({
  declarations: [SystemLayoutComponent],
  imports: [
    SharedModule,
    PccSdPortalComponentModule,
  ],
})
export class LayoutModule {}

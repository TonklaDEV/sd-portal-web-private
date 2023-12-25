import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from './layouts/layout.module';

import { PageModule } from './pages/page.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, LayoutModule, PageModule, AppRoutingModule,
    JwtModule.forRoot({
    config: {
      tokenGetter: () => {
        return localStorage.getItem('access_token');
      },
    },
  }),
],
  bootstrap: [AppComponent],
  providers: [JwtHelperService],
})
export class AppModule {}

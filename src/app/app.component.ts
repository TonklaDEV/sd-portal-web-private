import { Component, ElementRef } from '@angular/core';

import { ThemeModeService } from './shared/services/theme-mode/theme-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title: string = 'pcc-sd-data-portal-web';

  constructor(private readonly themeModeService: ThemeModeService, private readonly elementRef: ElementRef) {
    this.themeModeService.$themeMode.subscribe((themeMode: boolean) => {
      if (themeMode) {
        this.elementRef.nativeElement.ownerDocument.body.classList.add('dark');
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#18191A';
      } else {
        this.elementRef.nativeElement.ownerDocument.body.classList.remove('dark');
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F9FAFB';
      }
    });
  }
}

import { Injectable } from "@angular/core";

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  private themeMode!: BehaviorSubject<boolean>;

  constructor() {
    if (localStorage.getItem('themeMode') === 'true') {
      this.themeMode = new BehaviorSubject(true);
    } else {
      this.themeMode = new BehaviorSubject(false);
    }
  }

  public get $themeMode(): BehaviorSubject<boolean> {
    return this.themeMode;
  }

  public setThemeMode(themeMode: boolean): void {
    localStorage.setItem('themeMode', themeMode.toString());
    this.themeMode.next(themeMode);
  }
}

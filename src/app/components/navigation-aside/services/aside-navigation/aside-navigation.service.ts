import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsideNavigationService {
  private openAsideNavigation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  public get $openAsideNavigation(): BehaviorSubject<boolean> {
    return this.openAsideNavigation;
  }

  public onToggleAsideNavigation(): void {
    this.openAsideNavigation.next(true);
  }
}

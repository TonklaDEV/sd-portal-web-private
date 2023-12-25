import { Component, ElementRef, HostListener } from '@angular/core';

import { AsideNavigationService } from '../navigation-aside/services/aside-navigation/aside-navigation.service';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeModeService } from '../../shared/services/theme-mode/theme-mode.service';

@Component({
  selector: 'app-header-system',
  templateUrl: './header-system.component.html',
  styleUrls: ['./header-system.component.scss'],
})
export class HeaderSystemComponent {
  user : any;
  protected themeMode: boolean = false;
  protected showProfile: boolean = false;

  constructor(
    private router: Router,
    private readonly asideNavigationService: AsideNavigationService,
    private readonly themeModeService: ThemeModeService,
    private readonly elementRef: ElementRef,
    private jwtService: JwtHelperService
  ) {
    this.themeMode = this.themeModeService.$themeMode.value;
  }

  @HostListener('document:click', ['$event'])
  protected onWindowClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfile = false;
    }
  }

  protected onToggleThemeMode(): void {
    this.themeMode = !this.themeMode;
    this.themeModeService.setThemeMode(this.themeMode);
  }

  protected onToggleAsideNavigation(): void {
    this.asideNavigationService.onToggleAsideNavigation();
  }

  protected onToggleProfile(): void {
    this.showProfile = !this.showProfile;
    // this.ngOnInit()
  }

  ngOnInit(){
    // window.location.reload();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken !== null) {
      const decodedToken= this.jwtService.decodeToken(accessToken);
      // this.user = JSON.stringify(decodedToken);
      this.user = decodedToken;
      console.log(this.user);
    } 
  }
  signout(){
    this.user = '';
    localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    // this.onToggleProfile();
    // this.loadWindow
    this.router.navigate(['/sign-in']);
  }
  loadWindow(){
    window.location.reload();
  }

  protected changePhoneFormatThai(phone: string): string {
    if (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return '';
  }
}

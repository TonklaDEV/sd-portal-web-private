import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { AsideNavigationService } from '../navigation-aside/services/aside-navigation/aside-navigation.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeModeService } from '../../shared/services/theme-mode/theme-mode.service';
import { HeaderService } from './services/header.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/api-services/auth.service';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header-system',
  templateUrl: './header-system.component.html',
  styleUrls: ['./header-system.component.scss'],
})
export class HeaderSystemComponent {
  @ViewChild('changePassSwal')
  public readonly changePassSwal!: SwalComponent;
  changePassForm!: FormGroup;
  secondsLeft: any;
  sendForm(arg0: any) {
    console.log(arg0);
    
  }
  user: any;
  protected themeMode: boolean = false;
  protected showProfile: boolean = false;
  changePassword: any;

  constructor(
    private router: Router,
    private readonly asideNavigationService: AsideNavigationService,
    private readonly themeModeService: ThemeModeService,
    private readonly elementRef: ElementRef,
    private jwtService: JwtHelperService,
    private headerService: HeaderService,
    private authService: AuthService,
    public readonly swalTargets: SwalPortalTargets,
    private fb: FormBuilder
  ) {
    this.themeMode = this.themeModeService.$themeMode.value;
    this.changePassForm = this.fb.group({
      oldPass: [''],
      newPass: [''],
      confPass: [''],
    });
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

  ngOnInit() {
    // window.location.reload();
    const accessToken = localStorage.getItem('access_token');
    if (accessToken !== null) {
      const decodedToken = this.jwtService.decodeToken(accessToken);
      // this.user = JSON.stringify(decodedToken);
      this.user = decodedToken;
    }
  }

  signout() {
    this.user = '';
    localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    // this.onToggleProfile();
    // this.loadWindow
    this.router.navigate(['/sign-in']);
  }
  loadWindow() {
    window.location.reload();
  }

  protected changePhoneFormatThai(phone: string): string {
    if (phone) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return '';
  }

  async changePassModal() {
    try {
      const result = await Swal.fire({
        title: 'เปลี่ยนรหัสผ่าน',
        html: `
          <input id="oldPassword" class="swal2-input" placeholder="รหัสเดิม...">
          <input id="newPassword" class="swal2-input" placeholder="รหัสใหม่...">
          <input id="confirmPassword" class="swal2-input" placeholder="ยืนยันรหัสใหม่...">
        `,
        focusConfirm: false,
        preConfirm: () => {
          return [
            (<HTMLInputElement>document.getElementById('swal-input1')).value,
            (<HTMLInputElement>document.getElementById('swal-input2')).value,
            (<HTMLInputElement>document.getElementById('swal-input3')).value,
          ];
        },
      });
      if (result.isConfirmed) {
        let uid = this.user.sub;
        const formValues = result.value;
        console.log(formValues);

        Swal.fire(JSON.stringify(formValues));
        // ทำอะไรก็ตามที่คุณต้องการกับค่า formValues ที่ได้รับ
      }
    } catch (error) {
      console.error('Error in changePassModal', error);
      Swal.fire('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  }
}

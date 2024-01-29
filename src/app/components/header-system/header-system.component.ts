import { Component, ElementRef, HostListener } from '@angular/core';

import { AsideNavigationService } from '../navigation-aside/services/aside-navigation/aside-navigation.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThemeModeService } from '../../shared/services/theme-mode/theme-mode.service';
import { HeaderService } from './services/header.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/api-services/auth.service';

@Component({
  selector: 'app-header-system',
  templateUrl: './header-system.component.html',
  styleUrls: ['./header-system.component.scss'],
})
export class HeaderSystemComponent {
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
    private authService: AuthService
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
        title: "เปลี่ยนรหัสผ่าน",
        html: `
          <input id="oldPassword" class="swal2-input" placeholder="รหัสเดิม...">
          <input id="newPassword" class="swal2-input" placeholder="รหัสใหม่...">
          <input id="confirmPassword" class="swal2-input" placeholder="ยืนยันรหัสใหม่...">
        `,
        focusConfirm: false,
        preConfirm: async () => {
          const oldPassword = (<HTMLInputElement>document.getElementById("oldPassword")).value;
          const newPassword = (<HTMLInputElement>document.getElementById("newPassword")).value;
          const confirmPassword = (<HTMLInputElement>document.getElementById("confirmPassword")).value;
  
          // เรียกใช้ service เพื่อเปลี่ยนรหัสผ่าน
          const uid = this.user.sub;
  
          // ตรวจสอบข้อมูลที่กรอกเพื่อดำเนินการต่อ
          if (!uid) {
            Swal.fire({
              icon: 'error',
              title: 'ไม่พบผู้ใช้งาน',
            });
            return;
          }
  
          if (oldPassword.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'กรุณากรอกรหัสเดิม',
            });
            return;
          }
          if (oldPassword.length === 0 || newPassword.length === 0|| confirmPassword.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'ไม่ควรใช้รหัสเดิม',
            });
            return;
          }
  
          if (newPassword.length === 0 || confirmPassword.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่านใหม่',
            });
            return;
          }
  
          if (newPassword !== confirmPassword) {
            Swal.fire({
              icon: 'error',
              title: 'รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน',
            });
            return;
          }
  
          try {
            await this.headerService.changePassword(uid, oldPassword, newPassword, confirmPassword).toPromise();
            Swal.fire({
              icon: 'success',
              title: 'เปลี่ยนรหัสผ่านเรียบร้อย',
            });
          } catch (error) {
            console.error('Error changing password', error);
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
            });
          }
        }
      });
    } catch (error) {
      console.error('Error in changePassModal', error);
      Swal.fire('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  }
  
  
  



}

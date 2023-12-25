import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/api-services/auth.service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private jwtService: JwtHelperService,) { }
  alert: boolean = false;
  signinForm: any;
  errorMessage: string = ''; // ใช้เพื่อแสดงข้อความข้อผิดพลาด
  private alertTimeout = new Subject<void>();
  ngOnInit(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // เขียนฟังก์ชันที่เช็คว่าฟอร์มถูกกรอกครบหรือไม่
  isFormValid(): boolean {
    return this.signinForm.valid;
  }



  loginBtn(): void {
    this.authService.login(this.signinForm.value.email, this.signinForm.value.password).subscribe(
      (response) => {
        if (response.msg === "Invalid username/password supplied") {
          this.alert = true;
          this.signinForm.reset();
          setTimeout(() => {
            this.alertTimeout.next();
          }, 3000);
  
          this.alertTimeout.subscribe(() => {
            this.alert = false;
          });
        } else {
          // ดำเนินการตามความต้องการเมื่อการเข้าสู่ระบบสำเร็จ
          // เช่น บันทึก token หรือไปยังหน้าหลัก
          // console.log(response); // รายละเอียดการตอบสนองจาก API
  
          // สามารถบันทึก token ไว้ใน localStorage หรือ sessionStorage ได้
          localStorage.setItem('access_token', response.accessToken);
  
          // ดึงข้อมูล role จาก JWT
          const decodedToken = this.jwtService.decodeToken(response.accessToken);
          const userRoles = decodedToken.role.map((role: { authority: any; }) => role.authority) || [];
  
          // console.log('User Roles: ', userRoles);
  
          // นำผู้ใช้ไปยังหน้า '/pccth'
          this.router.navigate(['/pccth/detail']);
        }
      },
      (error) => {
        // ดำเนินการเมื่อการเข้าสู่ระบบไม่สำเร็จ
        // เช่น แสดงข้อความข้อผิดพลาด
        console.error(error); // รายละเอียดข้อผิดพลาด
        this.alert = true;
        this.signinForm.reset();
        setTimeout(() => {
          this.alertTimeout.next();
        }, 3000);
  
        this.alertTimeout.subscribe(() => {
          this.alert = false;
        });
      }
    );
  }
  
  
  
}




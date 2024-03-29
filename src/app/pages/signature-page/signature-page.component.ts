import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { SignatureService } from 'src/app/api-services/signature.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signature-page',
  templateUrl: './signature-page.component.html',
  styleUrls: ['./signature-page.component.scss'],
})
export class SignaturePageComponent implements OnInit {
  selectedImage: File | null = null;
  signatureBlob: Blob | null = null;
  signatureImageUrl: SafeUrl | null = null;
  previewImageUrl: string | null = null;
  userId: number | null = 0; // หรือค่าเริ่มต้นที่ไม่ใช่ null
  users: any;

  constructor(
    private _snackBar: MatSnackBar,
    private signatureService: SignatureService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
    // console.log('add img');
    this.previewSelectedImage();
  }

  uploadImage() {
    // console.log('userid:', this.userId, 'img:', this.selectedImage);
    this.showLoading()
    if (this.selectedImage && this.userId) {
      // คำขอ HTTP สำหรับการอัปโหลดรูปภาพ
      this.signatureService
        .uploadSignature(this.userId, this.selectedImage)
        .subscribe(
          (response) => {
            Swal.fire({
              title: 'สำเร็จ',
              text: 'อัปโหลดลายเซ็นสำเร็จแล้ว',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'ยืนยัน',
            }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => {
                  location.reload();
                }, 500); // 1 วินาทีหรือ 1,000 มิลลิวินาที
              }
            });
            // เมื่อคุณต้องการรีเฟรชหน้าเว็บในอีก 1 วินาทีหลังจากอัปโหลดรูปภาพเรียบร้อย
          },
          (error) => {
            // console.error('ข้อผิดพลาดในการอัปโหลดรูปภาพ', error);
            // แจ้งว่าบันทึกไม่สำเร็จ
            Swal.fire({
              title: 'อัปโหลดไม่สำเร็จ',
              text: 'อัปโหลดลายเซ็นไม่สำเร็จ',
              icon: 'error',
            });
          }
        );
    }
  }

  loadSignatureImage(userId: number): void {
    this.signatureService.getSignatureImage(userId).subscribe(
      (imageBlob: Blob) => {
        this.signatureBlob = imageBlob;
        // แปลง Blob เป็น URL และเก็บลิงก์ใน signatureImageUrl
        this.signatureImageUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(imageBlob)
        );
      },
      (error) => {
        if (error.status === 404) {
          this.signatureImageUrl = null; // ไม่มีลายเซ็นในระบบ
        } else {
          console.error('ข้อผิดพลาดในการดึงรูปภาพ', error);
        }
      }
    );
  }

  previewSelectedImage() {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.previewImageUrl = null;
    }
  }

  onUserIdSelected() {
    if (this.userId !== null) {
      // โหลดรูปลายเซ็นของผู้ใช้ที่ถูกเลือกโดยใช้ this.userId
      this.loadSignatureImage(this.userId);
    }
  }

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  ngOnInit(): void {
    this.showLoading();
    const UID = this.authService.getUID();
    this.getEmpByAdmin(UID);
    // this.loadSignatureImage(3)
    // console.log(this.userId);

    const role = this.authService.checkRole();
    if (role !== 'ROLE_Admin') {
      this.router.navigate(['/pccth/detail']);
    }
  }

  private showLoading() {
    Swal.fire({
      title: 'Now loading',
      text: 'กำลังดำเนินการโปรดรอซักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  getEmpByAdmin(id: number) {
    this.signatureService.getEmpByAdmin(id).subscribe((res) => {
      this.users = res.filter((item: any) => {
        const hasRole =
          item.roles[0].role == 'Approver' ||
          item.roles[0].role == 'VicePresident' ||
          item.roles[0].role == 'Manager' ||
          item.roles[0].role == 'President';
        return hasRole;
      });
      setTimeout(() => {
        Swal.close();
      }, 2000);
    });
  }

  // loadApprover(id: number) {
  //   this.signatureService.getUserById(id).subscribe((response) => {
  //     let res = response.responseData.result;
  //     let departments = res.departments.map((item: any) => item.id);
  //     this.loadAllUsers(departments);
  //   });
  // }

  // loadAllUsers(deptIds: any) {
  //   this.signatureService.findActiveEmp().subscribe((res) => {
  //     let allDeptUser = res.filter((item: any) =>
  //       item.departments.some((dept: any) => deptIds.includes(dept.id))
  //     );
  //     this.users = allDeptUser.filter((item: any) => {
  //       const hasROLE =
  //         item.roles[0].role == 'Approver' ||
  //         item.roles[0].role == 'VicePresident' ||
  //         item.roles[0].role == 'Manager' ||
  //         item.roles[0].role == 'President';
  //       return hasROLE;
  //     });
  //     setTimeout(() => {
  //       Swal.close();
  //     }, 2000);
  //   });
  // }
}

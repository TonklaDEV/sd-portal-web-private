import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/api-services/auth.service';
import { CourseService } from 'src/app/api-services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-course-page',
  templateUrl: './manage-course-page.component.html',
  styleUrls: ['./manage-course-page.component.scss'],
})
export class ManageCoursePageComponent implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private _service: CourseService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  CourseForm: any;
  //rows: Array<any> = [];
  selectedRow: any;
  courseResult: any;
  pageLength: number = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  selectedTime!: string; // เวลาจะเป็น string

  ngOnInit(): void {
    this.CourseForm = this.fb.group({
      id: [''],
      courseName: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      timestart: ['', Validators.required],
      timeend: ['', Validators.required],
      hours: ['', Validators.required],
      note: [''],
      price: ['', Validators.required],
      priceProject: [''],
      institute: ['', Validators.required],
      place: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.getFindAll();

    // console.log('in manage-course')
    const role = this.authService.checkRole();
    if (role !== 'ROLE_Admin') {
      this.router.navigate(['/pccth/detail']);
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadingpage())).subscribe();
  }

  loadingpage() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.courseResult = this.allCourse.slice(startIndex, endIndex);
  }

  startDate!: Date;
  endDate!: Date;
  showdataErrorMessage!: any;

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    return `${year}-${month}-${day}`;
  }

  allCourse: any;
  getFindAll() {
    this._service.getFindAll().subscribe({
      next: (result) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        this.allCourse = this._service.sortData(result, 'id', 'asc');
        this.pageLength = this.allCourse.length
        this.courseResult = this.allCourse.slice(0, 5);
        //this.parentResult = result;
        // console.log('courseResult:', this.courseResult);
        if (this.courseResult.length === 0) {
          this.showdataErrorMessage = true; // Show the error message
        } else {
          this.showdataErrorMessage = false; // Hide the error message
        }
      },
      error: console.log,
    });

    console.log(this.typeStatus());
    console.log(this.selectedType);
    // this.typeStatus();
  }

  addSv1Btn() {
    this.CourseForm.patchValue({
      startDate: this.formatDateToYYYYMMDD(this.CourseForm.value.startDate),
      endDate: this.formatDateToYYYYMMDD(this.CourseForm.value.endDate),
    });

    if (this.CourseForm.valid) {
      // Get the values of timestart and timeend
      const timestartValue = this.CourseForm.get('timestart').value;
      const timeendValue = this.CourseForm.get('timeend').value;

      // Merge timestart and timeend into a single time field
      const mergedTime = `${timestartValue}-${timeendValue}`;

      // Update the CourseForm with the merged time
      this.CourseForm.patchValue({ time: mergedTime });

      // Send the form data as JSON to the backend
      const formData = {
        courseName: this.CourseForm.get('courseName').value,
        startDate: this.CourseForm.get('startDate').value,
        endDate: this.CourseForm.get('endDate').value,
        time: mergedTime,
        hours: this.CourseForm.get('hours').value,
        note: this.CourseForm.get('note').value,
        price: this.CourseForm.get('price').value,
        priceProject: this.CourseForm.get('priceProject').value,
        institute: this.CourseForm.get('institute').value,
        place: this.CourseForm.get('place').value,
        type: this.CourseForm.get('type').value,
      };
      console.log('Form Data:', formData);

      // เรียกใช้งาน addCourse จาก service เพื่อส่งข้อมูลไปยังเซิร์ฟเวอร์
      this._service.addCourse(formData).subscribe({
        next: (response) => {
          // ตอบรับหลังจากการส่งข้อมูลสำเร็จ
          // console.log('Response:', response);

          // เพิ่มข้อมูลลงในตารางหรือหน้าเว็บตามที่คุณต้องการ
          // this.courseResult.push(response);

          // รีเซ็ตฟอร์ม
          this.CourseForm.reset();
        },
        error: (error) => {
          // จัดการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
          console.error('Error:', error);
        },
      });
    }
    location.reload();
  }

  isEditMode = false;

  cancelEdit() {
    // Clear the form and exit edit mode
    this.CourseForm.reset();
    this.isEditMode = false;
    this.selectedRow = null;
  }

  startEdit(id: number) {
    // Make an HTTP GET request to retrieve the data for the selected course
    // console.log('edit ID:', id);
    this._service.getCoursebyId(id).subscribe((data: any) => {
      // Check if data is valid
      if (data && data.responseData && data.responseData.result) {
        const result = data.responseData.result;
        // Populate the form with the data from the server response
        this.CourseForm.patchValue({
          id: result.id,
          courseName: result.courseName || '', // Check for courseName existence
          startDate: new Date(result.startDate) || new Date(), // Provide default date
          endDate: new Date(result.endDate) || new Date(), // Provide default date
          timestart: result.time ? result.time.split('-')[0] : '',
          timeend: result.time ? result.time.split('-')[1] : '',
          hours: result.hours,
          note: result.note || '', // Check for note existence
          price: result.price || 0, // Provide default value or check for existence
          priceProject: result.priceProject, // Provide default value or check for existence
          institute: result.institute || '', // Check for institute existence
          place: result.place || '', // Check for place existence
          type: result.type || '',
        });

        // console.log('edit data:', this.CourseForm.value);

        // Enable edit mode
        this.isEditMode = true;

        // Scroll to the form element
        const formElement = document.getElementById('course-form'); // Replace 'course-form' with the actual ID of your form element
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Handle invalid or missing data here
        console.error('Invalid or missing data from the server');
      }
    });
  }

  // Function to update data in edit mode
  updateSv1Btn(id: number) {
    this.CourseForm.patchValue({
      startDate: this.formatDateToYYYYMMDD(this.CourseForm.value.startDate),
      endDate: this.formatDateToYYYYMMDD(this.CourseForm.value.endDate),
    });

    if (this.CourseForm.valid) {
      // Get the updated values from the form
      const updatedData = {
        courseId: this.CourseForm.get('id').value, // เพิ่ม course_id ที่ถูกดึงมาจากฟอร์ม
        courseName: this.CourseForm.get('courseName').value,
        startDate: this.CourseForm.get('startDate').value,
        endDate: this.CourseForm.get('endDate').value,
        time: `${this.CourseForm.get('timestart').value}-${
          this.CourseForm.get('timeend').value
        }`,
        hours: this.CourseForm.get('hours').value,
        note: this.CourseForm.get('note').value,
        price: this.CourseForm.get('price').value,
        priceProject: this.CourseForm.get('priceProject').value,
        institute: this.CourseForm.get('institute').value,
        place: this.CourseForm.get('place').value,
        type: this.CourseForm.get('type').value,
      };

      console.log('Update Data:', updatedData);

      // เรียกใช้งาน editCourse เพื่อส่งข้อมูลการแก้ไขไปยังเซิร์ฟเวอร์
      this._service.editCourse(id, updatedData).subscribe({
        next: (result) => {
          // ทำตามที่คุณต้องการหลังจากการอัปเดตข้อมูลเสร็จสิ้น
          // console.log('Update Successful:', result);

          // อัปเดตข้อมูลในตารางหรือหน้าเว็บตามที่คุณต้องการ
          if (this.selectedRow) {
            this.selectedRow.courseName = updatedData.courseName;
            this.selectedRow.startDate = updatedData.startDate;
            this.selectedRow.endDate = updatedData.endDate;
            this.selectedRow.time = updatedData.time;
            this.selectedRow.hours = updatedData.hours;
            this.selectedRow.note = updatedData.note;
            this.selectedRow.price = updatedData.price;
            this.selectedRow.priceProject = updatedData.priceProject;
            this.selectedRow.institute = updatedData.institute;
            this.selectedRow.place = updatedData.place;
            this.selectedRow.type = updatedData.type;
          }

          // Reset the form and exit edit mode
          this.CourseForm.reset();
          this.isEditMode = false;
          this.selectedRow = null;
        },
        error: (error) => {
          console.error('Update Failed:', error);
          // ดำเนินการตามที่คุณต้องการเมื่อการอัปเดตล้มเหลว
        },
      });
    }
    location.reload();
  }

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  deleteSv1Btn(id: number) {
    // console.log('delete ID:', id);
    this._service.deleteId(id).subscribe({
      next: (result) => {
        // console.log(result)
        location.reload();
      },
      error: (err) => {
        console.error(err);
        // alert('ไม่สามารถลบพนักงานรายนี้ได้');
        this._snackBar.open(
          'ไม่สามารถลบหัวข้อการอบรมนี้ได้เนื่องจากถูกผูกกับการส่งฝึกอบรม',
          'ปิด',
          {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          }
        );
      },
    });

    // location.reload();
  }

  onBlurPrice(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();

    if (inputValue !== '') {
      if (inputValue.includes('.')) {
        const parts = inputValue.split('.');
        if (parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
          inputValue = parts.join('.');
        }
      } else {
        inputValue += '.00';
      }

      inputElement.value = inputValue;

      this.CourseForm.get('price').setValue(inputValue);
    }
  }

  onBlurpriceProject(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();

    if (inputValue !== '') {
      if (inputValue.includes('.')) {
        const parts = inputValue.split('.');
        if (parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
          inputValue = parts.join('.');
        }
      } else {
        inputValue += '.00';
      }

      inputElement.value = inputValue;

      this.CourseForm.get('priceProject').setValue(inputValue);
    }
  }

  invalidPriceInput: boolean = false;
  invalidPriceProjectInput: boolean = false;
  invalidhoursInput: boolean = false;

  onInputKeyPressPrice(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidPriceInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidPriceInput = true;
    } else {
      this.invalidPriceInput = false;
    }
  }

  onInputKeyPresspriceProject(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidPriceProjectInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidPriceProjectInput = true;
    } else {
      this.invalidPriceProjectInput = false;
    }
  }

  onInputKeyPresshours(event: KeyboardEvent) {
    const inputChar = event.key;

    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidhoursInput = true;
    } else {
      this.invalidhoursInput = false;
    }
  }

  selectedType: any;
  showErrorMessage!: boolean;

  typeStatus() {
    console.log(this.selectedType);
    if (this.selectedType === 'อบรม') {
      this.getFindAllCourse();
    } else if (this.selectedType === 'สอบ') {
      this.getFindAllTest();
    }
  }

  getFindAllCourse() {
    this._service.getFindAllCourse().subscribe({
      next: (result) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        const courseResult = this._service.sortData(result, 'id', 'asc'); // เรียงข้อมูลตามคอลัมน์ 'propertyName' ในลำดับ 'asc'
        this.allCourse = courseResult
        this.pageLength = this.allCourse.length
        this.courseResult = this.allCourse.slice(0,5)
        //this.parentResult = result;
        // console.log('courseResult:', this.courseResult);
        // ตรวจสอบถ้าข้อมูลเป็น []
        if (result.length === 0) {
          this.showErrorMessage = true;
        } else {
          this.showErrorMessage = false;
        }
      },
      error: console.log,
    });
  }

  getFindAllTest() {
    this._service.getFindAllTest().subscribe({
      next: (result) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        const courseResult = this._service.sortData(result, 'id', 'asc'); // เรียงข้อมูลตามคอลัมน์ 'propertyName' ในลำดับ 'asc'
        this.allCourse = courseResult
        this.pageLength = this.allCourse.length
        this.courseResult = this.allCourse.slice(0,5)
        // ตรวจสอบถ้าข้อมูลเป็น []
        if (result.length === 0) {
          this.showErrorMessage = true;
        } else {
          this.showErrorMessage = false;
        }
      },
      error: console.log,
    });
  }

  showModal = false;

  toggleModal() {
    this.showModal = !this.showModal;
  }

  selectedUserId: any;

  openConfirmationModal(userId: number): void {
    // this.selectedUserId = userId;
    // this.showModal = true;
    Swal.fire({
      title: 'ลบหัวข้อการอบรม',
      text: 'คุณต้องการลบหัวข้อการอบรมนี้หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'เสร็จสิ้น',
          text: 'หัวข้อการอบรมถูกลบแล้ว',
          icon: 'success',
        });
        this.deleteSv1Btn(userId);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrSv1ServicesService } from 'src/app/api-services/ftr-sv1-services.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ftr-sv1-page',
  templateUrl: './ftr-sv1-page.component.html',
  styleUrls: ['./ftr-sv1-page.component.scss'],
})
export class FtrSv1PageComponent implements OnInit {
  // @ViewChild('yearAndDepartment', { static: false })
  // yearAndDepartment!: ElementRef;

  trainingForm!: FormGroup;
  rows: Array<any> = [];
  year: any;
  department: any;
  company: any;
  // remark: string = '';
  total: number = 0; // เริ่มต้นค่า total เป็น 0

  showErrorMessage!: boolean;
  showdataErrorMessage!: boolean;

  constructor(
    private fb: FormBuilder,
    private _service: FtrSv1ServicesService,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.initDept();
    this.getUserList();

    this.organizeDataByYear();
    this.shouldDisplayYear = true;
    this.shouldDisplayCompany = true;
    this.shouldDisplayDept = true;

    this.trainingForm = this.fb.group({
      companyName: ['', Validators.required],
      year: ['', Validators.required],
      department: ['', Validators.required],
      budgetTraining: ['', Validators.required],
      budgetCer: ['', Validators.required],
      total_exp: ['', [Validators.required]],
    });

    this.searchAndLockSelection();
    // console.log('in ftr-sv1')
    const role = this.authService.checkRole();
    if (role !== 'ROLE_Personnel') {
      this.router.navigate(['/pccth/detail']);
    }
  }

  getUserList() {
    this._service.Getuser().subscribe({
      next: (res) => {
        if (Array.isArray(res) && res.length === 0) {
          this.showdataErrorMessage = true; // ไม่พบข้อมูล
        } else {
          this.showdataErrorMessage = false; // มีข้อมูล
          // กระทำอื่น ๆ กับข้อมูลเช่นการเรียงลำดับ
          this.rows = res.sort(
            (
              a: { year: string; company: string; departmentCode: string },
              b: { year: any; company: any; departmentCode: any }
            ) => {
              // ให้เรียงตาม "year" ก่อน
              if (a.year === b.year) {
                // ถ้า "year" เท่ากันให้เรียงตาม "company"
                if (a.company === b.company) {
                  // ถ้า "company" เท่ากันให้เรียงตาม "departmentCode"
                  return a.departmentCode.localeCompare(b.departmentCode);
                }
                return a.company.localeCompare(b.company);
              }
              return a.year.localeCompare(b.year);
            }
          );
        }
      },
      error: console.log,
    });
  }

  findBudgetParams(searchParams: any) {
    this._service.findBudgetParams(searchParams).subscribe((data) => {
      // เรียงลำดับข้อมูลตามลำดับปี >> บริษัท >> แผนก
      this.rows = data.sort(
        (
          a: { year: string; company: string; departmentCode: string },
          b: { year: string; company: string; departmentCode: string }
        ) => {
          if (a.year === b.year) {
            if (a.company === b.company) {
              return a.departmentCode.localeCompare(b.departmentCode);
            }
            return a.company.localeCompare(b.company);
          }
          return a.year.localeCompare(b.year);
        }
      );

      // ตรวจสอบว่าข้อมูลเป็น []
      if (Array.isArray(data) && data.length === 0) {
        this.showErrorMessage = true; // ไม่พบข้อมูล
        this.rows = [];
        this.shouldDisplayYear = false;
        this.shouldDisplayCompany = false;
        this.shouldDisplayDept = false;
      } else {
        this.showErrorMessage = false; // มีข้อมูล
        this.showdataErrorMessage = false;
        this.shouldDisplayYear = true;
        this.shouldDisplayCompany = true;
        this.shouldDisplayDept = true;

        // ทำอะไรกับข้อมูลที่ได้รับ เช่นการกำหนดค่าให้คอมโพเนนต์เพื่อแสดงในหน้าเว็บ
      }
    });
  }

  fetchTotalBudget(year: string, departmentCode: string) {
    this._service.getTotalBudget(year, departmentCode).subscribe(
      (totalBudget) => {
        // console.log(totalBudget);

        if (
          typeof totalBudget === 'object' &&
          'responseMessage' in totalBudget
        ) {
          // Check if 'responseMessage' exists in the response
          this.showErrorMessage = true; // Show the error message
        } else {
          this.showErrorMessage = false; // Hide the error message
          this.totalBudget = totalBudget;
        }
      },
      (error) => {
        if (error.status === 400 || error.status === 500) {
          this.showErrorMessage = true; // Show the error message
        } else {
          console.error(
            'An error occurred while fetching the total budget:',
            error
          );
        }
      }
    );
  }

  RemainBudget: any;
  fetchTotalRemain(year: string, departmentCode: string) {
    this._service.getTotalRemain(year, departmentCode).subscribe(
      (RemainBudget) => {
        // console.log(RemainBudget);

        if (Array.isArray(RemainBudget) && RemainBudget.length === 0) {
          this.showErrorMessage = true; // Show the error message
        } else if (RemainBudget) {
          // ตรวจสอบว่า RemainBudget ไม่เป็น null หรือ undefined
          this.showErrorMessage = false; // Hide the error message
          this.RemainBudget = RemainBudget;
        } else {
          // ในกรณีที่ RemainBudget เป็น null หรือ undefined
          this.showErrorMessage = true; // Show the error message
        }
      },
      (error) => {
        if (error.status === 400 || error.status === 500) {
          this.showErrorMessage = true; // Show the error message
        } else {
          console.error(
            'An error occurred while fetching the total budget:',
            error
          );
        }
      }
    );
  }

  searchAndLockSelection() {
    this.trainingForm.valueChanges.subscribe((formValue) => {
      const companyNameValue =
        formValue.companyName === 'PCCTH'
          ? 1
          : formValue.companyName === 'WiseSoft'
          ? 2
          : '';

      // สร้าง searchParams จากค่าในฟอร์ม
      const searchParams: any = {};

      if (formValue.year) {
        searchParams.year = formValue.year;
      }

      if (formValue.department.deptCode) {
        searchParams.departmentCode = formValue.department.deptCode;
      }

      if (companyNameValue) {
        searchParams.companyId = companyNameValue;
      }

      this.findBudgetParams(searchParams);

      if (formValue.year && formValue.department.deptCode) {
        this.fetchTotalBudget(formValue.year, formValue.department.deptCode);
        this.fetchTotalRemain(formValue.year, formValue.department.deptCode);
      }

      this.isFooterVisible = true;
    });
  }

  private temporaryValues = {
    budgetCer: null,
    budgetTraining: null,
    total_exp: null,
  };

  //สร้างฟังก์ชันสำหรับเพิ่มข้อมูล
  addSv1Btn() {
    if (this.trainingForm.valid) {
      const inputdata = this.trainingForm.value;

      // คัดลอกค่า companyName, year, และ department
      const companyName = this.trainingForm.get('companyName')?.value;
      const year = this.trainingForm.get('year')?.value;
      const department = this.trainingForm.get('department')?.value;

      // รีเซตค่าในฟอร์ม ยกเว้น companyName, year, และ department
      this.trainingForm.reset({ companyName, year, department });

      // กำหนดค่าให้กับตัวแปรชั่วคราว
      this.temporaryValues.budgetCer = inputdata.budgetCer;
      this.temporaryValues.budgetTraining = inputdata.budgetTraining;
      this.temporaryValues.total_exp = inputdata.total_exp;

      // ปิดการแก้ไขช่อง input โดยตั้งค่าเป็น readonly
      // this.trainingForm.get('companyName')?.disable();
      // this.trainingForm.get('year')?.disable();
      // this.trainingForm.get('department')?.disable();

      // ในกรณีนี้คุณสามารถสร้าง JSON จากค่าตัวแปรชั่วคราวและเพิ่มข้อมูลใน this.rows
      const company_Id = companyName === 'PCCTH' ? 1 : 2;
      const _year = year;
      const _department = department.deptCode;

      const rowData = {
        year: year,
        deptCode: _department,
        company_Id: company_Id,
        budgetTraining: this.temporaryValues.budgetTraining,
        budgetCer: this.temporaryValues.budgetCer,
        total_exp: this.temporaryValues.total_exp,
      };

      // console.log(inputdata);

      this._service.addSv1(rowData).subscribe({
        next: (result) => {
          Swal.fire({
            title: 'สำเร็จ',
            text: 'เพิ่มหรือแก้ไขงบประมาณสำเร็จ',
            icon: 'success',
          });
          // เรียกใช้ findBudgetParams เพื่อค้นหาข้อมูล
          this.findBudgetParams(searchParams);
          // console.log('searchParams', searchParams);
          this.fetchTotalBudget(_year, _department);
          this.fetchTotalRemain(_year, _department);
        },
        // error: console.log, // หรือจัดการข้อผิดพลาดตามที่คุณต้องการ
        error: (error) => {
          console.error('Error during addSv1:', error);
          // แสดงข้อความผลลัพธ์จาก API ที่ส่งกลับมา
          Swal.fire({
            title: 'ไม่สามารถแก้ไขได้',
            text: 'งบที่ต้องการอัพเดต มีค่าต่ำกว่างบที่ใช้ไป',
            icon: 'warning',
          });
          // this._snackBar.open('งบที่ต้องการอัพเดต มีค่าต่ำกว่างบที่ใช้ไป', 'ปิด', {
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        },
      });

      // สร้าง searchParams จากค่าในฟอร์ม
      const searchParams: any = {};

      if (_year) {
        searchParams.Year = _year;
      }

      if (_department) {
        searchParams.department_code = _department;
      }

      if (company_Id) {
        searchParams.company_id = company_Id;
      }

      if (this.temporaryValues.budgetTraining !== null) {
        searchParams.budgetTraining = this.temporaryValues.budgetTraining;
      }

      if (this.temporaryValues.budgetCer !== null) {
        searchParams.budgetCer = this.temporaryValues.budgetCer;
      }

      if (this.temporaryValues.total_exp !== null) {
        searchParams.total_exp = this.temporaryValues.total_exp;
      }
    }
  }

  showedit = true;

  editSv1Btn() {
    this.trainingForm
      .get('budgetTraining')
      ?.setValue(this.totalBudget.budgetTrain);
    this.trainingForm.get('budgetCer')?.setValue(this.totalBudget.budgetCer);
    this.trainingForm.get('total_exp')?.setValue(this.totalBudget.budgetTotal);
  }

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  onDepartmentClick() {
    this.showedit = false;
    const selectedCompany = this.trainingForm.get('companyName')?.value;

    if (!selectedCompany) {
      Swal.fire({
        // title: "The Internet?",
        text: 'โปรดเลือกบริษัทก่อน',
        icon: 'warning',
      });
      // this._snackBar.open('โปรดเลือกบริษัทก่อน', 'ปิด', {
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      // });
      // Reset department value
      this.trainingForm.get('department')?.setValue('');
    }
    this.trainingForm.get('budgetTraining')?.setValue('');
    this.trainingForm.get('budgetCer')?.setValue('');
    this.trainingForm.get('total_exp')?.setValue('');
  }

  // สร้างฟังก์ชันสำหรับรีเฟรชฟอร์ม
  refreshBtn() {
    // Use location.reload() to refresh the window
    location.reload();
  }

  invalidtotal_expInput: boolean = false;
  invalidYearInput: boolean = false;
  invalidNoInput: boolean = false;
  invalidFeeInput: boolean = false;
  invalidAccommodationExpInput: boolean = false;

  //เพิ่ม .00 ออโต้
  onBlurTotal() {
    // const inputElement = event.target as HTMLInputElement;
    // let inputValue = inputElement.value.trim();
    let inputValue = this.totalBudget.toString();
    if (inputValue !== '') {
      // Check if the input value contains a decimal point
      if (inputValue.includes('.')) {
        const parts = inputValue.split('.');
        if (parts[1].length > 2) {
          // Truncate the decimal part to 2 decimal places
          parts[1] = parts[1].substring(0, 2);
          inputValue = parts.join('.');
        }
      } else {
        // If there is no decimal point, add ".00"
        inputValue += '.00';
      }

      // inputElement.value = inputValue;
      // Set the value of totalExp in the form control
      this.trainingForm.get('total_exp')?.setValue(inputValue);
      // console.log('blur');
    }
  }

  totalBudget: any;

  onTotalBudget() {
    // console.log(this.trainingForm.get('budgetTraining'));
    // console.log(this.trainingForm.get('budgetCer'));
    if (
      this.trainingForm.get('budgetTraining')?.value != '' &&
      this.trainingForm.get('budgetCer')?.value != ''
    ) {
      this.totalBudget =
        +this.trainingForm.get('budgetTraining')?.value +
        +this.trainingForm.get('budgetCer')?.value;

      // this.totalBudget = this.totalBudget.toString
      // console.log(this.totalBudget.toString());
      this.invalidtotal_expInput = false;

      this.onBlurTotal();
    } else {
      this.trainingForm.get('total_exp')?.setValue(null);
      this.invalidtotal_expInput = true;
    }
  }

  onBlurFee(event: Event) {
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

      this.trainingForm.get('budgetTraining')?.setValue(inputValue);
    }
  }

  onBlurAccommodation(event: Event) {
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

      this.trainingForm.get('budgetCer')?.setValue(inputValue);
    }
  }

  //ควบคุมการป้อนข้อมูลให้รับเฉพาะตัวเลขไม่เกิน 4 ตัวเท่านั้น
  onInputKeyPressYear(event: KeyboardEvent) {
    const inputChar = event.key;
    //const inputValue = (event.target as HTMLInputElement).value;

    // Check if the input is not a digit or if it's not exactly 4 digits
    if (!/^\d+$/.test(inputChar)) {
      //|| inputValue.length >= 4
      event.preventDefault();
      this.invalidYearInput = true;
    } else {
      this.invalidYearInput = false;
    }
  }

  onInputKeyPressNo(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidNoInput = true;
    } else {
      this.invalidNoInput = false;
    }
  }

  //ควบคุมการป้อนข้อมูลให้รับเฉพาะตัวเลขเท่านั้น

  onInputKeyPressFee(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    } else {
      this.invalidFeeInput = false;
    }
  }

  onInputKeyPressAccommodation(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidAccommodationExpInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidAccommodationExpInput = true;
    } else {
      this.invalidAccommodationExpInput = false;
    }
  }

  /////////////////////////////
  currentYear = new Date().getFullYear();
  buddhistYear = this.currentYear;
  endYear: number = this.buddhistYear + 4;
  startYear: number = this.buddhistYear - 2;

  getYearsRange(): number[] {
    const years: number[] = [];
    for (let year = this.startYear; year <= this.endYear; year++) {
      years.push(year);
    }
    return years;
  }
  /////////////////////////////

  generateReport() {
    this._service.Report().subscribe(
      (base64Pdf: string) => {
        // แปลงข้อมูล Base64 เป็นไฟล์ PDF
        const byteCharacters = atob(base64Pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // สร้าง URL สำหรับไฟล์ PDF
        const pdfUrl = URL.createObjectURL(blob);

        // เปิด PDF ในหน้าต่างใหม่
        window.open(pdfUrl, '_blank');
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ PDF:', error);
        // แสดงข้อความหรือกระทำอื่นในกรณีเกิดข้อผิดพลาด
      }
    );
  }

  exportexcel(): void {
    // // สร้าง WorkSheet
    // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]); // สร้าง WorkSheet ที่ไม่มีข้อมูล
    // // เริ่มที่แถว A3
    // ws['!ref'] = 'A4';
    // // เรียกใช้ฟังก์ชัน calculateTotal() เพื่อคำนวณค่า Total
    // // const total = this.calculateTotal();
    // // ตรวจสอบว่า ws['!ref'] มีค่าหรือไม่
    // if (ws['!ref']) {
    //   // เพิ่มค่า Total ลงในชีท ws
    //   ws[`G${ws['!ref'].split(':').pop()}`] = { v: total, t: 'n' };
    // }
    // // สร้างข้อมูลสำหรับแถวแรก (A1 ถึง G1)
    // ws['!merges'] = [
    //   { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Merge A1 to G1
    //   { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Merge A2 to G2
    // ];
    // ws['A1'] = {
    //   v: 'Training Needs for Year ' + this.readonlyYear,
    //   t: 's',
    //   s: {
    //     alignment: {
    //       vertical: 'center',
    //       horizontal: 'center',
    //     },
    //   },
    // };
    // ws['A2'] = { v: 'Department ' + this.readonlyDepartment, t: 's' };
    // // รับข้อมูลจากตาราง 'data-table' และเพิ่มลงใน WorkSheet ที่เริ่มที่แถว A3
    // let tableElement = document.getElementById('data-table');
    // const tableWs: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);
    // XLSX.utils.sheet_add_json(ws, XLSX.utils.sheet_to_json(tableWs), {
    //   origin: 'A4',
    // });
    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'FTR-SV1');
    // /* save to file */
    // XLSX.writeFile(wb, 'FTR-SV1.xlsx');
  }

  // exportexcel(): void {
  //   /* pass here the table id */
  //   let element = document.getElementById('data-table');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  //   // เรียกใช้ฟังก์ชัน calculateTotal() เพื่อคำนวณค่า Total
  //   const total = this.calculateTotal();

  //   // ตรวจสอบว่า ws['!ref'] มีค่าหรือไม่
  //   if (ws['!ref']) {
  //     // เพิ่มค่า Total ลงในชีท ws
  //     ws[`G${ws['!ref'].split(':').pop()}`] = { v: total, t: 'n' };
  //   }

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'FTR-SV1');

  //   /* save to file */
  //   XLSX.writeFile(wb, 'FTR-SV1.xlsx');
  // }
  pccDept: any;
  wsDept: any;
  depts: any;
  uniqueDepts: any;

  initDept() {
    this._service.getDeptsWithSector().subscribe(
      (res) => {
        this.pccDept = res.filter((dept) => dept.company === 'PCCTH');
        this.wsDept = res.filter((dept) => dept.company === 'WiseSoft');
        this.pccDept = this.pccDept.map((item: any) => item.department);
        this.wsDept = this.wsDept.map((item: any) => item.department);
        this.pccDept = this.filterAndMapDepartments(this.pccDept);
        this.wsDept = this.filterAndMapDepartments(this.wsDept);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Function to filter and map unique departments
  filterAndMapDepartments(deptList1: any[] = []): any[] {
    const uniqueDeptsMap = new Map<string, any>();

    deptList1.forEach((dept: any) => {
      if (!uniqueDeptsMap.has(dept.deptCode)) {
        uniqueDeptsMap.set(dept.deptCode, {
          deptCode: dept.deptCode,
          deptName: dept.deptName,
        });
      }
    });

    return Array.from(uniqueDeptsMap.values());
  }

  companyModel: string = 'PCCTH';
  selectCompany(company: string) {
    this.trainingForm.get('department')?.setValue('');
    this.companyModel = company;
    if (this.companyModel === 'PCCTH') {
      this.depts = this.pccDept;
    } else if (this.companyModel === 'WiseSoft') {
      this.depts = this.wsDept;
    }
  }

  shouldDisplayYear = false;
  shouldDisplayCompany = false;
  shouldDisplayDept = false;

  panelOpenState = false;

  yearsData: { year: number; data: any[] }[] = [];

  private organizeDataByYear() {
    // นำข้อมูลใน rows มาจัดหมวดหมู่ตามปี
    const years = [...new Set(this.rows.map((row) => row.year))];

    years.forEach((year) => {
      const dataForYear = this.rows.filter((row) => row.year === year);
      this.yearsData.push({ year, data: dataForYear });
    });
  }

  isFooterVisible: boolean = false;

  lastDisplayedCompany: string = '';
}

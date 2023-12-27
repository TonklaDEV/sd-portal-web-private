import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api-services/auth.service';
import { UserService } from 'src/app/api-services/user.service';
import {
  Sectors,
  allDeptCompany,
} from 'src/environments/interfaces/environment-options.interface';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs';

@Component({
  selector: 'app-manage-user-page',
  templateUrl: './manage-user-page.component.html',
  styleUrls: ['./manage-user-page.component.scss'],
})
export class ManageUserPageComponent implements OnInit, AfterViewInit {
  test: any;
  UserForm: any;
  invalidNoInput: boolean = false;
  dept: string = ''; // เพิ่มคุณสมบัติ 'dept' เป็น string
  department: string = '';
  userResult: any;
  isEmpCodeDuplicate: boolean = false;
  isEmailDuplicate: boolean = false;
  isEditMode: boolean = false;
  allposition: any;
  pageLength: number = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private serviceuser: UserService,
    private _snackBar: MatSnackBar
  ) {
    this.searchForm = this.formBuilder.group({
      name: [''], // ตั้งค่าเริ่มต้นเป็นค่าว่าง
    });
    this.UserForm = this.formBuilder.group({
      id: [''],
      company: ['PCCTH', Validators.required],
      sectorCode: ['', Validators.required],
      sectorName: ['', Validators.required],
      deptCode: ['', Validators.required],
      deptName: ['', Validators.required],
      empCode: ['', Validators.required],
      title: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      positionName: ['', Validators.required],
      email: ['', Validators.email],
      role: ['', Validators.required],
    });
  }

  async ngOnInit() {
    //filter sector dept and company
    this.showLoading();
    const UID = this.authService.getUID();
    this.filterByAdmin(UID);
    this.getAllEmpWithAdmin(UID);
    this.getAllposition();
    //ROLE USER CHECK!!
    const role = this.authService.checkRole();
    if (role !== 'ROLE_Admin') {
      this.router.navigate(['/pccth/detail']);
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadingpage())).subscribe();
  }

  filterMode: boolean = false;
  filterEmpData: any;
  loadingpage() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    if (this.filterMode) {
      this.pageLength = this.filterEmpData.length;
      this.userResult = this.filterEmpData.slice(startIndex, endIndex);
    } else {
      this.userResult = this.centerEmp.slice(startIndex, endIndex);
    }
  }
  onSubmit() {
    if (this.UserForm.valid) {
      // console.log(this.UserForm.value);
    }
    this.UserForm.reset();
  }
  filterdata!: any;
  filterByAdmin(id: number) {
    this.serviceuser.findDeptByAdmin(id).subscribe((res) => {
      this.filterdata = res[0];
      this.initAllData();
    });
  }

  getAllposition() {
    this.serviceuser.findAllPosition().subscribe((res) => {
      this.allposition = res;
    });
  }
  // โค้ดใน ngOnInit
  postEmployeeUser() {
    // สร้างข้อมูลพนักงาน
    const employeeData = {
      // companyName: this.UserForm.get('company').value,
      companyID: [this.companyid],
      sectorID: [this.sectorID],
      // sectorName: this.UserForm.get('sectorName').value,
      // sectorCode: this.UserForm.get('sectorCode').value,
      empCode: this.UserForm.get('empCode').value,
      deptID: [this.deptID],
      dept_actual: this.deptID,
      sector_actual: this.sectorID,
      title: this.UserForm.get('title').value,
      firstname: this.UserForm.get('firstname').value,
      lastname: this.UserForm.get('lastname').value,
      email: this.UserForm.get('email').value,
      positionName: this.UserForm.get('positionName').value,
      roles: [this.UserForm.get('role').value],
    };

    // เรียกใช้งาน postEmployee ใน UserService
    // console.log(JSON.stringify(employeeData));

    this.serviceuser.postEmployee(employeeData).subscribe(
      (response) => {
        // console.log('Data saved successfully:', response);
        // ทำสิ่งที่คุณต้องการกับข้อมูลที่ส่งกลับจากเซิร์ฟเวอร์
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
        });
        console.log(response);
        setTimeout(() => {
          location.reload();
        }, 1500);
        // location.reload(); // หลังจากบันทึกข้อมูลเรียบร้อยแล้ว รีโหลดหน้าเพื่อแสดงข้อมูลใหม่
      },
      (error) => {
        console.error('Error while saving data:', error);

        if (error.status === 500) {
          // console.log('error', error.error);
          // console.log('error.error.message', error.error.responseMessage);
          // console.log('error?.message', error?.responseMessage);
          // console.log('json message error', JSON.parse(error.error).responseMessage);
          switch (JSON.parse(error.error).responseMessage) {
            case 'Email is already in use.':
              // console.log("test2");
              this.isEmpCodeDuplicate = false;
              this.isEmailDuplicate = true;
              break;
            case 'EmpCode is already in use.':
              this.isEmpCodeDuplicate = true;
              this.isEmailDuplicate = false;
              // console.log("test3");
              break;
            case 'Both Email and EmpCode are already in use.':
              this.isEmpCodeDuplicate = true;
              this.isEmailDuplicate = true;
              // console.log("test3");
              break;
            default:
              // console.log("test4");
              console.log(error);
          }
        }
      }
    );
  }

  filterEmpByDept!: any;
  getAllEmpWithAdmin(id: number) {
    this.serviceuser.getEmployeeById(id).subscribe((response) => {
      let res = response.responseData.result;
      this.filterEmpByDept = res.departments;
      this.getAllEmployeeAndStatus(id);
    });
  }

  centerEmp!: any;
  allEmps!: any;
  getAllEmployeeAndStatus(id: number) {
    // console.log('click');
    console.log(id);
    this.serviceuser.getActiveEmp(id).subscribe({
      next: (result) => {
        this.allEmps = result;
        let filteredData = result.filter((item: any) =>
          this.filterEmpByDept.some((filterDept: any) =>
            item.departments.some((dept: any) => dept.id == filterDept.id)
          )
        );
        // console.log('all emp', result);

        // console.log('filter dept', this.filterEmpByDept);
        // console.log('filter emp by dept', filteredData);

        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        this.centerEmp = this.serviceuser.sortData(
          filteredData,
          'user_id',
          'asc'
        );
        // เรียงข้อมูลตามคอลัมน์ 'user_id' ในลำดับ 'asc' และไม่รวม index แรก
        this.pageLength = this.centerEmp.length;
        this.userResult = this.centerEmp.slice(0, 5);
        // console.log('testtt', this.userResult);
        Swal.close();
      },
      error: console.log,
    });
  }

  processUserStatus(id: number, status: string) {
    // if (window.confirm("คุณต้องการอัปเดตสถานะผู้ใช้เป็น'ลาออก'ใช่หรือไม่?")) {
    // console.log('user id:', id + ' status:', status);

    // เรียก API สำหรับการอัปเดตสถานะของผู้ใช้
    this.serviceuser.putStatusToUser(id, status).subscribe(
      (response: any) => {
        // console.log('User status updated successfully:', response);
        if (response.responseMessage === 'ทำรายการเรียบร้อย') {
          // อัปเดตสถานะของผู้ใช้ในตัวแปร userResult
          const userToUpdate = this.userResult.find(
            (user: { id: number }) => user.id === id
          );
          if (userToUpdate) {
            userToUpdate.status = status;
          }
        }
      },
      (error) => {
        console.error('Error while updating user status:', error);
      },
      () => {
        // this.toggleModal(); // ปิด Modal เมื่อทำรายการเรียบร้อย
      }
    );
  }

  company!: string;
  companyid!: number;
  selectCompany(company: string) {
    this.company = company;
    // console.log(this.company);
    let companydata = this.filterdata.filter(
      (item: any) => item?.company == company
    );
    companydata = companydata?.map((item: any) => item?.sectors)?.flat();
    if (company == 'PCCTH') {
      this.Center_Sector = this.PCCTH_Sector;
      let sectorName = this.PCCTH_Sector.map((item) => item.sectorname);
      console.log('this pcc sector name', sectorName);
      this.sectorName = sectorName.filter((item: any) =>
        companydata.some((filterItem: any) => filterItem.sectorname == item)
      );
      this.companyid = 1;
      // this.depts = this.pccDept;
      // Clear selections for sector, dept, and position when selecting a new company
    } else if (company == 'WiseSoft') {
      this.Center_Sector = this.WS_Sector;
      let sectorName = this.WS_Sector.map((item) => item.sectorname);

      this.sectorName = sectorName.filter((item: any) =>
        companydata.some((filterItem: any) => filterItem.sectorname == item)
      );
      this.companyid = 2;

      console.log('this sectorname:', this.sectorName);

      // this.depts = this.wsDept;
      // Clear selections for sector, dept, and position when selecting a new company
    }
    this.UserForm.get('sectorName').setValue('');
    this.UserForm.get('deptName').setValue('');
    this.UserForm.get('positionName').setValue('');
    this.UserForm.get('sectorCode').setValue('');
    this.UserForm.get('deptCode').setValue('');
    this.UserForm.get('title').setValue('');
    this.UserForm.get('firstname').setValue('');
    this.UserForm.get('lastname').setValue('');
    this.UserForm.get('email').setValue('');
    this.UserForm.get('empCode').setValue('');
  }

  sectorName!: any;

  companies!: allDeptCompany[]; // ต้องมีการประกาศตัวแปร companies แบบนี้

  setSector() {
    //ดึงค่าฝ่ายที่ผู้ใช้เลือกจาก dropdown
    const selectedSectorName = this.UserForm.get('sectorName')?.value;
    //ดึงค่า object ตามฝ่าย และ ตาม admin(Back-end:in prgress)
    const selectedSectorObject = this.Center_Sector.filter(
      (item) => item.sectorname == selectedSectorName
    ); // <-- รอ filter ตาม Admin ด้วย

    //clear old data zone
    this.UserForm.get('deptName').setValue('');
    this.UserForm.get('positionName').setValue('');
    this.UserForm.get('deptCode').setValue('');
    this.UserForm.get('title').setValue('');
    this.UserForm.get('firstname').setValue('');
    this.UserForm.get('lastname').setValue('');
    this.UserForm.get('email').setValue('');
    this.UserForm.get('empCode').setValue('');

    //gen Departments and Sector code to field
    if (selectedSectorObject) {
      console.log('sectorid');

      console.log(selectedSectorObject[0].sectorid);
      this.sectorID = selectedSectorObject[0].sectorid;
      //ดึงข้อมูลแผนก
      let depts = selectedSectorObject.map((item) => item.departments);
      let filterDepts = this.filterdata
        .filter((item: any) => item.company == this.company)
        .map((item: any) => item.sectors)[0]
        .map((item: any) => item.departments)
        .flat();
      let filteredDepts = depts[0].filter((dept) =>
        filterDepts.some((filterDept: any) => filterDept.deptid == dept.deptid)
      );

      this.depts = filteredDepts;
      this.UserForm.get('sectorCode').setValue(
        selectedSectorObject[0].sectorcode
      );
    }
  }

  deptCodeModel!: string;
  deptID!: number;
  sectorID!: number;
  setDept() {
    const selectedDept = this.UserForm.get('deptName')?.value;
    const selectedDeptObject = this.depts.find(
      (department: any) => department.deptname === selectedDept
    );
    if (selectedDeptObject) {
      console.log(selectedDeptObject);
      // this.sectorID = selectedDeptObject.sectorid;
      this.deptCodeModel = selectedDeptObject.deptcode;
      this.UserForm.get('deptCode')?.setValue(this.deptCodeModel);
      this.deptID = selectedDeptObject.deptid;
      this.positions = selectedDeptObject.positions;
    }
    this.UserForm.get('positionName').setValue('');
    this.UserForm.get('title').setValue('');
    this.UserForm.get('firstname').setValue('');
    this.UserForm.get('lastname').setValue('');
    this.UserForm.get('email').setValue('');
    this.UserForm.get('empCode').setValue('');
  }

  positions!: any;
  //PCCTH
  //WiseSoft
  pccDept!: any;
  wsDept!: any;
  //The Middle dept array
  depts!: any;
  PCCTH_Sector!: Sectors[];
  WS_Sector!: Sectors[];
  Center_Sector!: Sectors[];
  PCC_SECTOR_DEPT: any;
  WS_SECTOR_DEPT: any;
  initAllData() {
    this.serviceuser.getAllDeptWithCompany().subscribe(
      (res) => {
        // กำหนดค่าให้กับ this.companies ด้วยข้อมูลที่ได้จาก API
        const sectors = res.map((item) => item.sectors);

        this.PCCTH_Sector = sectors[0]; // <--- เอาไปใช้เจน dept,postion ของ PCC
        this.WS_Sector = sectors[1]; // <--- เอาไปใช้เจ dept,postion ของ WS
        this.selectCompany('PCCTH'); //set Default company
        this.PCC_SECTOR_DEPT = this.MappingDATA_secID_deptID(this.PCCTH_Sector);
        this.WS_SECTOR_DEPT = this.MappingDATA_secID_deptID(this.WS_Sector);
        console.log('new map pcc', this.PCC_SECTOR_DEPT);
        console.log('new map ws', this.WS_SECTOR_DEPT);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // ฟังก์ชันสำหรับโหลดข้อมูลพนักงานและนำมาเติมในฟอร์ม
  emp_id!: number;
  editEmployee(id: number) {
    // console.log(id);
    this.serviceuser.getEmployeeById(id).subscribe(
      (employeeData: any) => {
        if (employeeData) {
          let res = employeeData.responseData.result; //เอาเฉพาะข้อมูล
          this.emp_id = id;
          //Zone กำหนดค่าที่(โคตร)ซับซ้อน
          console.log(res);

          this.selectCompany(res.companys[0].companyName);
          this.UserForm.get('company').setValue(res.companys[0].companyName);
          this.UserForm.get('sectorName').setValue(res.sectors[0].sectorName);
          this.setSector();
          this.UserForm.get('deptName').setValue(res.departments[0].deptName);
          this.setDept(); //deptID ถูกกำหนดตั้งแต่ตอนนี้แล้ว
          this.UserForm.get('positionName').setValue(res.position.positionName);
          this.UserForm.get('role').setValue(res.roles[0]?.role);

          //Zone กำหนดค่าแบบตรงๆ
          this.UserForm.get('empCode').setValue(res.empCode);
          this.UserForm.get('title').setValue(res.title);
          this.UserForm.get('firstname').setValue(res.firstname);
          this.UserForm.get('lastname').setValue(res.lastname);
          this.UserForm.get('email').setValue(res.email);
          this.isEditMode = true;

          // Scroll to the form element
          const formElement = document.getElementById('user-form'); // Replace 'yourFormId' with your actual form's element ID
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      },
      (error) => {
        console.error('Error while loading employee data:', error);
      }
    );
  }

  cancelEdit() {
    // Clear the form and exit edit mode
    this.UserForm.reset();
    this.isEditMode = false;
    this.isEmpCodeDuplicate = false;
    this.isEmailDuplicate = false;
  }

  // ฟังก์ชันสำหรับอัปเดตข้อมูลพนักงาน
  updateData() {
    let id = this.emp_id;
    const updatedData = {
      // companyName: this.UserForm.get('company').value,
      // sectorName: this.UserForm.get('sectorName').value,
      // sectorCode: this.UserForm.get('sectorCode').value,
      companyID: [this.companyid],
      sectorID: [this.sectorID],
      deptID: [this.deptID],
      empCode: this.UserForm.get('empCode').value, // เพิ่ม empCode กลับมา
      title: this.UserForm.get('title').value,
      firstname: this.UserForm.get('firstname').value,
      lastname: this.UserForm.get('lastname').value,
      email: this.UserForm.get('email').value,
      positionName: this.UserForm.get('positionName').value,
      roles: [this.UserForm.get('role').value],
      dept_actual: this.deptID,
      sector_actual: this.sectorID,
    };

    console.log('updatedData', updatedData);

    this.serviceuser.putEditEmployee(id, updatedData).subscribe(
      (response) => {
        // console.log('Employee data updated successfully:', response);
        // ทำสิ่งที่คุณต้องการหลังจากแก้ไขสำเร็จ
        // console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          position: 'center',
        });
        // this._snackBar.open('แก้ไขข้อมูลสำเร็จ', 'ปิด', {
        //   horizontalPosition: this.horizontalPosition,
        //   verticalPosition: this.verticalPosition,
        // });
        location.reload();
      },
      (error) => {
        console.error('Error while saving data:', error);
        if (error.status === 500) {
          // console.log('error', error.error);
          // console.log('error.error.message', error.error.responseMessage);
          // console.log('error?.message', error.responseMessage);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            // text: "เกิดข้อผิดพลาด",
            confirmButtonColor: '#3085d6',
            confirmButtonAriaLabel: 'OK',
            showConfirmButton: true,
            position: 'center',
          });
          let errorMessage =
            typeof error.error === 'string'
              ? error.error
              : error.error.responseMessage;

          switch (errorMessage) {
            case 'Email is already in use.':
              // console.log("test2");
              this.isEmpCodeDuplicate = false;
              this.isEmailDuplicate = true;
              break;
            case 'EmpCode is already in use.':
              this.isEmpCodeDuplicate = true;
              this.isEmailDuplicate = false;
              // console.log("test3");
              break;
            case 'Both Email and EmpCode are already in use.':
              this.isEmpCodeDuplicate = true;
              this.isEmailDuplicate = true;
              // console.log("test3");
              break;
            default:
              // console.log("test4");
              console.log(error);
          }
        }
      }
    );
  }

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  deleteById(id: number) {
    // console.log('delete in Post', id);
    // if (confirm('Do you want to delete?')) {
    this.serviceuser.deleteById(id).subscribe((res: any) => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
    // }
    // location.reload();
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

  searchValue: any;
  // selectedOption: string = '';
  searchForm!: FormGroup;
  selectedOption: string = '';

  onOptionSelected(event: any) {
    this.selectedOption = event.target.value;
  }

  showErrorMessage!: boolean;

  private showLoading() {
    Swal.fire({
      title: 'Now loading',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 2000,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        Swal.hideLoading();
      }
    });
  }
  
  

  getSearch() {
    if (this.searchForm !== null) {
      const searchParams: any = {};

      if (this.searchForm.get('name') !== null) {
        this.searchForm.get('name')?.patchValue(this.selectedOption);
      }

      const selectedOption = this.selectedOption;
      // console.log('searchForm', this.searchForm.value);
      // console.log('selectedOption', selectedOption);

      const searchValue = this.searchValue;
      // console.log('searchValue', searchValue);

      if (selectedOption === 'company') {
        searchParams.company = searchValue;
      } else if (selectedOption === 'deptName') {
        searchParams.deptName = searchValue;
      } else if (selectedOption === 'deptCode') {
        searchParams.deptCode = searchValue;
      } else if (selectedOption === 'email') {
        searchParams.email = searchValue;
      } else if (selectedOption === 'empCode') {
        searchParams.empCode = searchValue;
        // } else if (selectedOption === 'firstname') {
        //   searchParams.firstname = searchValue;
        // } else if (selectedOption === 'lastname') {
        //   searchParams.lastname = searchValue;
      } else if (selectedOption === 'name') {
        searchParams.name = searchValue;
      } else if (selectedOption === 'position') {
        searchParams.position = searchValue;
      } else if (selectedOption === 'sectorName') {
        searchParams.sectorName = searchValue;
      }

      if (searchValue) {
        this.showLoading()
        this.serviceuser.getSearchUser(searchParams).subscribe((data) => {
          this.filterMode = true
          if (data === 'ไม่พบรายการที่ต้องการค้นหา') {
            this.userResult = [];
            this.showErrorMessage = true; // Show the error message
            this.pageLength = 0;
          } else {
            // กรองผลลัพธ์ที่ได้จากการค้นหาเท่านั้น
            let filtered = data.filter((item: { id: any }) =>
              this.centerEmp.some((filter: any) => filter.id == item.id)
            );
            let sortdata = this.serviceuser.sortData(
              filtered,
              'user_id',
              'asc'
            );
            this.filterEmpData = sortdata
            this.paginator.pageIndex = 0
            this.paginator.pageSize = 5
            this.loadingpage()
            this.showErrorMessage = false; // Hide the error message
          }
          Swal.close();
          // console.log('data', data);
          // console.log('search data: ', this.userResult);
        });
      }
    } else {
      // ทำอย่างใดอย่างหนึ่งเมื่อ searchForm เป็น null
    }
  }

  showModal = false;
  modalType: string = '';
  selectedUserId: any;

  toggleModal() {
    this.showModal = false;
    this.modalType = '';
  }

  openConfirmationModal(userId: number, type: string): void {
    // this.selectedUserId = userId;
    // this.modalType = type;
    // this.showModal = true;
    let title = '';
    let text = '';
    let btnText = '';
    if (type == 'delete') {
      title = 'ต้องการลบข้อมูลหรือไม่?';
      text = 'คุณไม่สามารถกลับมาเปลี่ยนสถานะได้อีก';
      btnText = 'ลบข้อมูล';
    } else if (type == 'leave') {
      title = 'ต้องการเปลี่ยนสถานะข้อมูลหรือไม่';
      text = 'คุณสามารถกลับมาเปลี่ยนสถานะได้อีกครั้ง';
      btnText = 'เปลี่ยนสถานะ';
    }
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: btnText,
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed && type == 'leave') {
        Swal.fire({
          title: 'เปลี่ยนสถานะ!',
          text: 'ข้อมูลถูกเปลี่ยนสถานะแล้ว',
          icon: 'success',
        });
        this.processUserStatus(userId, 'ลาออก');
      } else if (result.isConfirmed && type == 'delete') {
        Swal.fire({
          title: 'ลบข้อมูล!',
          text: 'ข้อมูลถูกลบแล้ว',
          icon: 'success',
        });
        this.deleteById(userId);
      }
    });
  }

  showElements: boolean = false;

  toggleUpload() {
    this.showElements = !this.showElements;
  }

  PCC_EMP: any;
  WS_EMP: any;
  startRow = 0;
  fileUpload(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      console.log(event);
      let binaryData = event.target?.result;
      let workbook = XLSX.read(binaryData, { type: 'binary' });
      workbook.SheetNames.forEach((sheet) => {
        if (sheet == 'PCC') {
          this.startRow = 2;
        } else if (sheet == 'WS') {
          this.startRow = 3;
        }

        const range = {
          s: {
            r: this.startRow - 1,
            c: 0,
          },
          e: {
            r: 1000,
            c: 11,
          },
        };
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
          range,
        });
        let renameData = this.renamekey(data);
        if (sheet == 'PCC') {
          this.PCC_EMP = renameData;
          console.log('PCC_EMP', this.PCC_EMP);
        } else if (sheet == 'WS') {
          this.WS_EMP = renameData;
          console.log('WS_EMP', this.WS_EMP);
        }
      });
    };
  }

  private MappingDATA_secID_deptID(data: any) {
    return data.map((item: any) => {
      let sec_name = item.sectorname.split(' ');
      let formatted = sec_name.join('');
      return {
        sectorid: item.sectorid,
        sectorname: formatted,
        departments: item.departments.map((dept: any) => {
          return {
            deptid: dept.deptid,
            deptname: dept.deptname,
            deptcode: dept.deptcode,
          };
        }),
      };
    });
  }

  private addIDsToData(refdata: any, data: any) {
    const newData = data.map((item: any) => {
      const deptToUse = item?.dept || item?.sector;
      console.log('item', item);
      console.log('dept', item?.dept);
      console.log('sector', item?.sector);
      // เพิ่มเงื่อนไขในการใช้ค่า dept หรือ sector
      const matchedsector = refdata.find(
        (sector: any) => sector?.sectorname == item?.sector
      );
      const matchedDept = matchedsector?.departments.find(
        (dept: any) => dept?.deptname == deptToUse
      ); // ใช้ deptToUse แทน item?.dept
      return {
        ...item,
        deptid: matchedDept ? matchedDept.deptid : null,
        sectorid: matchedsector ? matchedsector.sectorid : null,
      };
    });
    return newData;
  }
  isLoading = true;
  statetext = '';
  async uploadData() {
    this.statetext = 'กำลังบันทึกข้อมูล ...';
    this.isLoading = false;
    let finalDataPCC: any = {};
    let finalDataWS: any = {};
    let alldata: any[] = [];
    if (this.PCC_EMP) {
      const pccdata = this.addIDsToData(this.PCC_SECTOR_DEPT, this.PCC_EMP);
      console.log('pccdata', pccdata);
      finalDataPCC = this.renameKeyForJsonCreateEmp(pccdata, 'PCC');
    }
    if (this.WS_EMP) {
      const wsdata = this.addIDsToData(this.WS_SECTOR_DEPT, this.WS_EMP);
      console.log('wsdata', wsdata);
      finalDataWS = this.renameKeyForJsonCreateEmp(wsdata, 'WS');
    }

    if (finalDataPCC && finalDataWS) {
      alldata = finalDataPCC.concat(finalDataWS);
    } else if (finalDataPCC && !finalDataWS) {
      alldata = finalDataPCC;
    } else if (!finalDataPCC && finalDataWS) {
      alldata = finalDataWS;
    }
    let failData: any[] = alldata.filter((item: any) => {
      return item.dept_actual == null;
    });
    let passData: any[] = alldata.filter((item: any) => {
      return item.dept_actual != null;
    });

    console.log('can action data: ', passData);
    console.log("can't action data: ", failData);

    // console.log('null dept',alldata.filter((item:any) => {
    //   return item.dept_actual == null
    // }));
    console.log('before query :', passData, length);

    passData = passData.filter((passItem: any) => {
      return !this.allEmps.some((allEmpsItem: any) => {
        return (
          allEmpsItem.empCode == passItem.empCode &&
          allEmpsItem.firstname == passItem.firstname &&
          allEmpsItem.lastname == passItem.lastname &&
          allEmpsItem.email == passItem.email
        );
      });
    });

    console.log(this.allEmps);

    console.log('after query :', passData);

    await this.compareAndinsertPosition(passData);
    // console.log(JSON.stringify(alldata[0]));

    // this.serviceuser
    //   .postEmployee(alldata[0])
    //   .subscribe((res) => console.log(res));
    let faildata: any[] = [];
    let succes = 0;
    let fail = 0;
    for (let index = 0; index < passData.length; index++) {
      try {
        const res = await this.serviceuser
          .postEmployee(passData[index])
          .toPromise();
        succes++;
      } catch (error: any) {
        fail++;
        const errorData = JSON.parse(error.error); // ทำการแปลงข้อมูล error จาก JSON string ให้เป็น Object
        faildata.push({ ...passData[index], error: errorData.responseMessage });
      }
    }

    this.statetext = 'บันทึกข้อมูลสำเร็จ';
    // alert('บันทึกข้อมูลทั้งหมดแล้ว');
    console.log('Success: ', succes);
    console.log('Fail: ', fail);
    console.log('Fail Data: ', faildata);

    setTimeout(() => {
      this.isLoading = true;
    }, 1000);
  }

  renamekey(data: any) {
    return data.map((item: any) => {
      let renamedData: any = {};
      Object.entries(item).forEach(([key, value]) => {
        switch (key) {
          case 'ชื่อพนักงาน':
            if (value === 'น.ส.') {
              value = value.replace('น.ส.', 'นางสาว');
            }
            renamedData['title'] = value;
            break;
          case '__EMPTY' || 'ชื่อ':
            renamedData['fname'] = value;
            break;
          case '__EMPTY_1':
          case 'นามสกุล':
            renamedData['sname'] = value;
            break;
          case 'รหัส':
            renamedData['empcode'] = value;
            break;
          case 'ตำแหน่ง':
          case 'ตำแหน่งงาน':
            renamedData['position'] = value;
            break;
          case 'ระดับ':
          case '__EMPTY_2':
            renamedData['level'] = value;
            break;
          case 'อีเมล':
          case 'Email':
            renamedData['email'] = value;
            break;
          case 'แผนก':
          case '__EMPTY_3':
            renamedData['dept'] =
              value === null ? item['__EMPTY_4' || 'sector'] : value;
            break;
          case 'ฝ่าย':
          case '__EMPTY_4':
            renamedData['sector'] = value;
            break;
          default:
            renamedData[key] = value;
            break;
        }
      });
      return renamedData;
    });
  }

  private renameKeyForJsonCreateEmp(data: any, company: string) {
    if (company == 'PCC') {
      return data.map((item: any) => {
        return {
          empCode: item.empcode,
          title: item.title,
          firstname: item.fname,
          lastname: item.sname,
          positionName: item.position,
          email: item.email,
          dept_actual: item.deptid,
          sector_actual: item.sectorid,
          deptID: [item.deptid],
          sectorID: [item.sectorid],
          roles: ['User'], //default
          companyID: [1],
        };
      });
    } else if (company == 'WS') {
      return data.map((item: any) => {
        return {
          empCode: item.empcode,
          title: item.title,
          firstname: item.fname,
          lastname: item.sname,
          positionName: item.position,
          email: item.email,
          dept_actual: item.deptid,
          sector_actual: item.sectorid,
          deptID: [item.deptid],
          sectorID: [item.sectorid],
          roles: ['User'], //default
          companyID: [2],
        };
      });
    }
  }

  async compareAndinsertPosition(data: any) {
    let currentPositions = this.allposition.map((item: any) => {
      return {
        positionName: item.positionName,
        departmentId: item.department.id,
      };
    });

    let addposition = data.map((item: any) => {
      return {
        positionName: item.positionName,
        departmentId: item.dept_actual,
      };
    });
    console.log('before add new position: ', addposition);
    addposition = addposition.filter((newPos: any) => {
      return !currentPositions.some(
        (currentPos: any) =>
          currentPos.positionName === newPos.positionName &&
          currentPos.departmentId === newPos.departmentId
      );
    });
    let uniqueSet = new Set();
    addposition = addposition.filter((newPos: any) => {
      const key = `${newPos.positionName}-${newPos.departmentId}`;
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        return true;
      }
      return false;
    });
    // console.log('current position: ', currentPositions);
    console.log('add new position: ', addposition);

    let fail_count = 0;
    let pass_count = 0;
    let failData: any[] = [];
    for (let index = 0; index < addposition.length; index++) {
      try {
        const element = addposition[index];
        const res = await this.serviceuser.createPosition(element).toPromise();
        pass_count++;
      } catch (error: any) {
        fail_count++;
        failData.push({
          data: addposition[index],
          error: error.error.responseMessage,
        });
      }
    }
    console.log('failDATA: ', failData);
    console.log('pass count', pass_count);
    console.log('fail count', fail_count);
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isThisHour } from 'date-fns';
import { switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrOj1ServicesService } from 'src/app/api-services/ftr-oj1-services.service';
import { SignatureService } from 'src/app/api-services/signature.service';
import {
  EditSectionOne,
  EditSectionTwo,
} from 'src/environments/interfaces/environment-options.interface';
import Swal from 'sweetalert2';

// import { FtrOj1ServicesService } from './ftr-oj1-services.service';
@Component({
  selector: 'app-ftr-oj1-page',
  templateUrl: './ftr-oj1-page.component.html',
  styleUrls: ['./ftr-oj1-page.component.scss'],
})
export class FtrOj1PageComponent implements OnInit, AfterViewInit {
  modal: boolean = false;
  searchForm: any;
  empName: any;
  empRole: any;
  dept: any;
  parentResult: any;
  // ในคอมโพเนนต์ของคุณ
  showEditButton = true;
  showdataErrorMessage!: boolean;
  showErrorMessage!: boolean;

  //for record save date
  saveDate!: string;

  ////Form Group val
  sectionOne!: FormGroup;
  sectionTwo!: FormGroup;
  sectionG9!: FormGroup;

  //Action Date val
  @ViewChild('trainDate') trainDate!: ElementRef<HTMLInputElement>;
  // @ViewChild('getResultDate') getResultDate!: ElementRef<HTMLInputElement>;
  // @ViewChild('testDate') testDate!: ElementRef<HTMLInputElement>;
  @ViewChild('getCerDate') getCerDate!: ElementRef<HTMLInputElement>;

  //Budget etc
  @ViewChild('onBudegetRadio') onBudegetRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('etcDetails') etcDetails!: ElementRef<HTMLInputElement>;
  @ViewChild('etcRadio') etcRadio!: ElementRef<HTMLInputElement>;

  //result Radio
  @ViewChild('passRadio') passRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('failRadio') failRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('noResultRadio') noResultRadio!: ElementRef<HTMLInputElement>;

  //[fail , none] cause
  @ViewChild('fCause') fCause!: ElementRef<HTMLInputElement>;
  @ViewChild('nCause') nCause!: ElementRef<HTMLInputElement>;

  //sectionTwo enable check
  approveStatus = '';

  //page declare
  pageLength: number = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  signatureForm!: FormGroup; // เพิ่มตัวแปรสำหรับ FormGroup
  allParentsResult: any;
  pageEvent!: PageEvent;
  adminDeptsManage: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public ftroj1: FtrOj1ServicesService,
    private authService: AuthService,
    private signatureService: SignatureService,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar
  ) {
    this.sectionTwo = this.fb.group({
      evaluatorName: [''],
      evaluatorRole: [''],
      evaluatorDept: [''],
      evaluatorSector: [''],
      resultOne: ['', Validators.required],
      resultTwo: ['', Validators.required],
      resultThree: ['', Validators.required],
      resultFour: ['', Validators.required],
      resultFive: ['', Validators.required],
      resultSix: ['', Validators.required],
      resultSeven: ['', Validators.required],
      comment: [''],
      result: ['', Validators.required],
      cause: [''],
      plan: [''],
    });
    this.signatureForm = this.fb.group({
      trainId: 0, // ใช้ TrainID เป็นค่าเริ่มต้น
      userId1: 0, // คุณสามารถกำหนดค่า default ให้กับ control ได้ที่นี่
      userId2: 0,
      userId3: 0,
      userId4: 0,
    });

    this.searchForm = this.fb.group({
      company: new UntypedFormControl(null, [Validators.required]),
      empName: new UntypedFormControl(null, [Validators.required]),
      empRole: new UntypedFormControl(null, [Validators.required]),
      dept: new UntypedFormControl(null, [Validators.required]),
      courseName: new UntypedFormControl(null, [Validators.required]),
      startDate: new UntypedFormControl(null, [Validators.required]),
      endDate: new UntypedFormControl(null, [Validators.required]),
    });
    this.sectionOne = this.fb.group({
      inst: [''],
      deptCode: ['', Validators.required],
      deptName: ['', Validators.required],
      date: [''],
      topic: ['', Validators.required],
      objt: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fee: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      budget: ['', Validators.required],
      empCode: ['', Validators.required],
      empName: ['', Validators.required],
      empRole: ['', Validators.required],
      action: ['', Validators.required],
      actionDate: ['', Validators.required],
      // รอแก้ไขเพื่อ ชื่อตัวแปรบริษัท: ['', Validators.required],
    });
    this.sectionG9 = this.fb.group({
      resultGOne: ['', Validators.required],
      resultGTwo: ['', Validators.required],
      resultGThree: ['', Validators.required],
      resultGFour: ['', Validators.required],
      resultGFive: ['', Validators.required],
    });
  }
  role!: string;
  UserId: any;
  cancheckG9!: boolean;
  async ngOnInit() {
    this.showLoading();
    this.role = this.authService.checkRole();
    this.UserId = this.authService.getUID();
    const UID = this.authService.getUID();
    //prepare Data
    this.getAdminManageDept(UID);
    this.loadAllUsers();
    this.initCourse();
    this.filterDept(UID);
    this.showTestData();
    this.showCourseData();
    this.initsector();

    if (this.role === 'ROLE_User') {
      this.getFindTrainingByUserId(this.UserId);
      this.sectionG9.disable();
    } else if (
      this.role === 'ROLE_Approver' ||
      this.role === 'ROLE_Manager' ||
      this.role === 'ROLE_President' ||
      this.role === 'ROLE_VicePresident'
    ) {
      this.getFindTrainingByApproveId(this.UserId);
      this.sectionG9.enable();
    } else if (this.role === 'ROLE_Admin') {
      this.getSectorID(UID);
      this.sectionG9.disable();
    } else if (this.role == 'ROLE_Personnel') {
      this.getSectorID(UID);
      this.sectionG9.enable();
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadingpage())).subscribe();
  }
  filterMode = false;
  loadingpage() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    if (this.filterMode) {
      this.parentResult = this.allFilterParentsResult.slice(
        startIndex,
        endIndex
      );
    } else {
      this.parentResult = this.allParentsResult.slice(startIndex, endIndex);
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

  getAdminManageDept(UID: number) {
    this.ftroj1.getUserById(UID).subscribe((response) => {
      const res = response.responseData.result;
      this.alldeptManage = res.departments;
    });
  }
  async getSectorID(UID: number) {
    this.ftroj1
      .getUserInfo(UID)
      .subscribe((res) => this.getFindAll(res.responseData.result.departments));
  }

  getFindTrainingByPersonnel(id: number) {
    this.ftroj1.findTrainingByPersonnelId(id).subscribe({
      next: (result) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        this.parentResult = result.filter(
          (item) =>
            item.isDo !== 'รอประเมิน' || item.result_status !== 'ไม่อนุมัติ'
        ); // เรียงข้อมูลตามคอลัมน์ 'propertyName' ในลำดับ 'asc'
        this.allParentsResult = this.parentResult;

        if (this.parentResult.length === 0) {
          this.showdataErrorMessage = true; // Show the error message
        } else {
          this.showdataErrorMessage = false; // Hide the error message
        }
      },
      error: () => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการดึงข้อมูล',
          icon: 'error',
        });
      },
    });
  }
  resultForSearch: any;
  getFindTrainingByApproveId(id: number) {
    this.ftroj1.findTrainingByApproveId(id).subscribe({
      next: (result: any) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        result.sort((a: any, b: any) => b.training.id - a.training.id);
        if (
          this.role === 'ROLE_Approver' ||
          this.role == 'ROLE_Manager' ||
          this.role == 'ROLE_President'
        ) {
          this.allParentsResult = result;
          this.resultForSearch = result;
          const pageIndex = this.paginator?.pageIndex ?? 0;

          //paginator gendata in table
          if (pageIndex != 0) {
            //Another time
            this.loadingpage();
          } else {
            //First time
            this.parentResult = this.allParentsResult.slice(0, 3);
          }

          this.notiStatus();
        } else if (this.role === 'ROLE_VicePresident') {
          let firstFilter = result?.filter(
            (item: any) =>
              item.isDo !== 'รอประเมิน' || item.result_status !== 'ไม่อนุมัติ'
          );
          // let filteredDept = firstFilter.filter((item: any) =>
          //   item.training.user.departments?.some((dept: any) => deptIds.includes(dept.id))
          // );
          this.allParentsResult = firstFilter;
          this.resultForSearch = firstFilter;
          const pageIndex = this.paginator?.pageIndex ?? 0;

          //paginator gendata in table
          if (pageIndex != 0) {
            //Another time
            this.loadingpage();
          } else {
            //First time
            this.parentResult = this.allParentsResult.slice(0, 3);
          }
          this.notiStatus();
          if (this.allParentsResult.length === 0) {
            this.showdataErrorMessage = true; // Show the error message
          } else {
            this.showdataErrorMessage = false; // Hide the error message
          }
        }
        this.pageLength = this.allParentsResult.length;
        Swal.close();
      },
      error: () => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
          icon: 'error',
        });
      },
    });
  }

  modalToggle() {
    this.modal = true;
  }
  getFindByCount(count: number) {
    this.ftroj1.getTrainApproveByCount(count).subscribe({
      next: (result) => {
        this.allParentsResult = result;
        this.parentResult = this.allParentsResult; // เรียงข้อมูลตามคอลัมน์ 'propertyName' ในลำดับ 'asc'
      },
      error: () => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
          icon: 'error',
        });
      },
    });
  }
  getFindAll(dept: any) {
    this.ftroj1.findAllTraining().subscribe({
      next: (result) => {
        // ทำการเรียงลำดับข้อมูลโดยใช้ sortData()
        // เรียงข้อมูลตามคอลัมน์ 'propertyName' ในลำดับ 'asc'
        result.sort((a: any, b: any) => b.training.id - a.training.id);
        if (this.role == 'ROLE_Admin') {
          let filtereddept = result?.filter((item: any) =>
            dept?.some(
              (filter: any) =>
                filter?.id == item?.training?.user?.departments[0]?.id
            )
          );
          this.allParentsResult = filtereddept;
          const pageIndex = this.paginator?.pageIndex ?? 0;

          //paginator gendata in table
          if (pageIndex != 0) {
            //Another time
            this.loadingpage();
          } else {
            //First time
            this.parentResult = this.allParentsResult.slice(0, 3);
          }
        } else {
          this.allParentsResult = result;
          const pageIndex = this.paginator?.pageIndex ?? 0;
          if (pageIndex != 0) {
            //Another time
            this.loadingpage();
          } else {
            //First time
            this.parentResult = this.allParentsResult.slice(0, 3);
          }
        }

        if (this.parentResult.length === 0) {
          this.showdataErrorMessage = true; // Show the error message
        } else {
          this.showdataErrorMessage = false; // Hide the error message
        }
        this.resultForSearch = this.allParentsResult;
        this.pageLength = this.allParentsResult.length;
        Swal.close();
      },
      error: () => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
          icon: 'error',
        });
      },
    });
  }

  getFindTrainingByUserId(id: number) {
    this.ftroj1.findTrainingByUserId(id).subscribe({
      next: (results) => {
        // Filter the results to keep only those with result_status === 'อนุมัติ'
        this.parentResult = results.filter(
          (result: { result_status: string }) =>
            result.result_status === 'อนุมัติ'
        );
        this.allParentsResult = this.parentResult;

        if (this.parentResult.length === 0) {
          this.showdataErrorMessage = true; // Show the error message
        } else {
          this.showdataErrorMessage = false; // Hide the error message
        }

        // Now, 'approvedResults' contains only the results with 'อนุมัติ'
      },
      error: () => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
          icon: 'error',
        });
      },
    });
  }

  testData!: any;
  courseData!: any;

  showCourseData() {
    // เลือก "อบรม" ดึงข้อมูลคอร์สจาก API
    this.ftroj1.getCourse().subscribe(
      (res) => {
        this.courseData = res;
      },
      (error) => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
          icon: 'error',
        });
      }
    );
  }

  showTestData() {
    // เลือก "สอบ" ดึงข้อมูลการทดสอบจาก API
    this.ftroj1.getTest().subscribe(
      (res) => {
        this.testData = res;
      },
      (error) => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
          icon: 'error',
        });
      }
    );
  }

  onOptionSelected() {
    const selectedOption = this.searchForm.get('selectedOption').value;

    if (selectedOption === 'อบรม') {
      // เลือก "อบรม" ดึงข้อมูลคอร์สจาก API
      this.ftroj1.getCourse().subscribe(
        (res) => {
          this.courseData = res;
        },
        (error) => {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
            icon: 'error',
          });
        }
      );
    } else if (selectedOption === 'สอบ') {
      // เลือก "สอบ" ดึงข้อมูลการทดสอบจาก API
      this.ftroj1.getTest().subscribe(
        (res) => {
          this.testData = res;
        },
        (error) => {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'เกิดข้อพิดพลาดในการเข้าถึงข้อมูล',
            icon: 'error',
          });
        }
      );
    }
  }

  Approve(trainID: number, approve: string) {
    Swal.fire({
      title: approve,
      text: `คุณต้องการ "${approve}" หรือไม่`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ftroj1.approveTraining(trainID, this.UserId, approve).subscribe(
          (response) => {
            Swal.fire({
              title: 'สำเร็จ',
              text: 'ทำรายการเสร็จสิ้น',
              icon: 'success',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonText: 'ยืนยัน',
            }).then((result) => {
              if (result.isConfirmed) {
                this.getFindTrainingByApproveId(this.UserId);
              }
              this.clearAndCloseModal();
            });
          },
          (error) => {
            Swal.fire({
              title: 'ไม่สำเร็จ',
              text: 'ทำรายการไม่าสำเร็จ',
              icon: 'error',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonText: 'ยืนยัน',
            }).then((result) => {
              if (result.isConfirmed) {
                this.getFindTrainingByApproveId(this.UserId);
              }
              this.clearAndCloseModal();
            });
          }
        );
      }
    });
  }

  refreshBtn() {
    // Use location.reload() to refresh the window
    this.searchForm.reset();
  }

  approve_id = 0;
  cancelTrain(id: number) {
    this.showLoading();
    this.ftroj1.cancelTraining(id).subscribe((res) => {
      Swal.fire({
        title: 'สำเร็จ',
        text: 'ยกเลิกการอบรมสำเร็จ',
        icon: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: 'ตกลง',
      }).then((t) => {
        if (t.isConfirmed) {
          this.getSectorID(this.UserId);
        }
      });
    });
  }

  showPrintButton: boolean = false;
  showPrintButton1: boolean = false;

  getSearch() {
    const searchParams: any = {};
    this.selectedStatus = '';
    this.filterMode = false;

    if (this.searchForm.value.company) {
      searchParams.company = this.searchForm.value.company;
    }

    if (this.searchForm.value.empName) {
      searchParams.name = this.searchForm.value.empName;
    }

    if (this.searchForm.value.empRole) {
      searchParams.position = this.searchForm.value.empRole;
    }

    if (this.searchForm.value.dept) {
      searchParams.department = this.searchForm.value.dept;
    }

    if (this.searchForm.value.courseName) {
      searchParams.courseName = this.searchForm.value.courseName;
    }

    if (this.searchForm.value.startDate) {
      searchParams.startDate = this.searchForm.value.startDate;
    }

    if (this.searchForm.value.endDate) {
      searchParams.endDate = this.searchForm.value.endDate;
    }

    if (this.searchForm.value.startDate && this.searchForm.value.endDate) {
      searchParams.startDate = this.searchForm.value.startDate;
      searchParams.endDate = this.searchForm.value.endDate;

      // เพิ่มเงื่อนไขสำหรับการแสดงปุ่มพิมพ์
      this.showPrintButton = true;
    }

    if (
      this.searchForm.value.startDate &&
      this.searchForm.value.endDate &&
      this.searchForm.value.dept
    ) {
      searchParams.startDate = this.searchForm.value.startDate;
      searchParams.endDate = this.searchForm.value.endDate;
      searchParams.department = this.searchForm.value.dept;
      // เพิ่มเงื่อนไขสำหรับการแสดงปุ่มพิมพ์
      this.showPrintButton1 = true;
    }

    this.ftroj1.search(searchParams).subscribe((data) => {
      // ทำอะไรกับข้อมูลที่ได้รับจาก API ที่นี่
      // กรองข้อมูลใน data ให้เฉพาะที่มี training.id ที่เหมือนกันกับข้อมูลใน allParentsResult
      let filteredData = [];

      if (data === 'ไม่พบรายการที่ต้องการค้นหา' || data.length === 0) {
        this.showErrorMessage = true; // Show the error message
        this.parentResult = [];
        this.allParentsResult = [];
        this.pageLength = 0;
      } else {
        filteredData = this.resultForSearch.filter(
          (dataItem: { training: { id: any } }) => {
            return data.some(
              (parentResultItem: { training: { id: any } }) =>
                parentResultItem.training.id === dataItem.training.id
            );
          }
        );
        this.allParentsResult = filteredData;
        // this.allFilterParentsResult = filteredData
        this.parentResult = filteredData.slice(0, 3);
        this.pageLength = filteredData.length;
        this.showErrorMessage = false; // Hide the error message
      }
      this.paginator.pageIndex = 0;
    });
  }

  isSearchDisabled() {
    // ตรวจสอบว่าค่าในฟอร์มมีข้อมูลหรือไม่
    const formValues = this.searchForm.value;
    return Object.values(formValues).every((value) => {
      if (value === null || value === undefined) {
        return true; // ค่าเป็น null หรือ undefined ให้มีค่าเป็น true (disabled)
      }
      if (typeof value === 'string' && value.trim() === '') {
        return true; // ค่าเป็นสตริงว่าง ให้มีค่าเป็น true (disabled)
      }
      return false; // ค่ามีข้อมูล ให้มีค่าเป็น false (ไม่ disabled)
    });
  }

  // isSearchDisabled2(): boolean {
  //   if (this.role === 'ROLE_Admin') {
  //     if (
  //       this.searchForm.get('company').valid &&
  //       this.searchForm.get('startDate').valid &&
  //       this.searchForm.get('endDate').valid &&
  //       this.searchForm.get('dept').valid
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else if (this.role === 'ROLE_Personnel') {
  //     if (
  //       this.searchForm.get('company').valid &&
  //       this.searchForm.get('startDate').valid &&
  //       this.searchForm.get('endDate').valid
  //     ) {
  //       return true;
  //     } else if (
  //       this.searchForm.get('company').valid &&
  //       this.searchForm.get('courseName').valid
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
  // }
  generic9ButtonValid(): boolean {
    const { company, startDate, endDate, dept, courseName } =
      this.searchForm.controls;
    const isCompanyValid = company.valid;
    const isStartDateValid = startDate.valid;
    const isEndDateValid = endDate.valid;
    const isCourseValid = courseName.valid;
    const isDateRangeValid = isStartDateValid && isEndDateValid;
    return isCompanyValid && isDateRangeValid && isCourseValid;
  }

  trainingHistoryValid(): boolean {
    const { company, startDate, endDate, dept, courseName } =
      this.searchForm.controls;
    const isCompanyValid = company.valid;
    const isStartDateValid = startDate.valid;
    const isEndDateValid = endDate.valid;
    const isDeptValid = dept.valid;
    const isCourseValid = courseName.valid;
    const isDateRangeValid = isStartDateValid && isEndDateValid;

    if (this.role === 'ROLE_Admin') {
      return (
        isCompanyValid && isStartDateValid && isEndDateValid && isDeptValid
      );
    } else {
      // Personnel ROLE
      return (
        isCourseValid ||
        isDateRangeValid ||
        (isDateRangeValid && isCourseValid) ||
        (isDateRangeValid && isDeptValid) ||
        (isDateRangeValid && isDeptValid && isCourseValid)
      );
    }
  }

  isSearchDisabled2(): boolean {
    const isCompanyInvalid = this.searchForm.get('company').invalid;
    const isStartDateInvalid = this.searchForm.get('startDate').invalid;
    const isEndDateInvalid = this.searchForm.get('endDate').invalid;
    const isDeptInvalid = this.searchForm.get('dept').invalid;

    return (
      isCompanyInvalid ||
      isStartDateInvalid ||
      isEndDateInvalid ||
      isDeptInvalid
    );
  }

  courses!: any;

  initCourse() {
    this.ftroj1.getCourses().subscribe(
      (res) => {
        this.courses = res;
        // เมื่อคุณได้รับข้อมูล course จาก API
        // คุณสามารถกำหนดค่าเริ่มต้นให้กับฟิลด์ courseName ด้วยค่าที่คุณต้องการ
        this.searchForm.get('courseName')?.setValue(this.courses.CourseName); // ตั้งค่า courseName
      },
      (error) => {
        console.error('Error while get data: ', error);
      }
    );
  }

  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
    if (this.showModal == false) {
      let radioLabel = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
      for (let index = 0; index < radioLabel.length; index++) {
        this.sectionTwo.get('result' + radioLabel[index])?.setValue('');
      }
      this.sectionTwo.get('cause')?.setValue('');
      this.sectionTwo.get('plan')?.setValue('');
      this.sectionTwo.get('result')?.setValue('');
      this.sectionTwo.get('comment')?.setValue('');
      this.approveStatus = '';
    }
  }

  createEditForm(id: number) {
    this.toggleModal();

    this.ftroj1.getDatabyId(id).subscribe((res) => {
      this.populateFormGroup(this.sectionOne, res);
      this.populateFormGroup(this.sectionTwo, res);

      this.formatDateFields(
        ['date', 'startDate', 'endDate', 'actionDate'],
        this.sectionOne
      );

      //////////// รอแก้ไข //////////////////////////////
      this.selectCompany('PCCTH'); // รอเปลี่ยน อันนี้ตัว dummy ซือๆ
      //selectCompany(this.sectionOne.get('ชื่อตัวแปรบริษัท')?.value)
      // ตรวจสอบค่า budget และตั้งค่า etcRadio และ etcDetails ตามค่าที่ได้

      if (this.sectionOne.get('budget')?.value != 'อยู่ในงบประมาณ') {
        this.etcRadio.nativeElement.checked = true;
        this.etcDetails.nativeElement.value =
          this.sectionOne.get('budget')?.value;
      } else if (this.sectionOne.get('budget')?.value == 'อยู่ในงบประมาณ') {
        this.onBudegetRadio.nativeElement.checked = true;
        this.etcDetails.nativeElement.value = '';
      }

      if (this.sectionTwo.get('result')?.value != null) {
        this.resultSelect(this.sectionTwo.get('result')?.value);
      }

      this.safeSaveDate();
      this.initActionDate(this.sectionOne.get('action')?.value);
    });
  }

  populateFormGroup(formGroup: FormGroup, data: any) {
    const formControls = formGroup.controls;

    for (const key in data) {
      if (formControls[key]) {
        formControls[key].setValue(data[key]);
      }
    }
  }

  formatDateFields(fields: string[], formGroup: FormGroup) {
    fields.forEach((field) => {
      const control = formGroup.get(field);
      if (control) {
        control.setValue(this.formatDate(control.value));
      }
    });
  }

  formatDate(date: string) {
    const dateFormatted = date.split(' ');
    return dateFormatted[0];
  }

  setInputValues = (
    train: string,

    getCer: string
  ) => {
    this.trainDate.nativeElement.value = train;

    this.getCerDate.nativeElement.value = getCer;
  };

  initActionDate(action: string) {
    const actionDateControl = this.sectionOne.get('actionDate');

    if (actionDateControl) {
      switch (action) {
        case 'training':
          this.setInputValues(actionDateControl.value, '');
          break;
        case 'getCertificate':
          this.setInputValues('', actionDateControl.value);
          break;
        default:
          this.setInputValues('', '');
      }
    }
  }

  changeActionDate(action: string) {
    switch (action) {
      case 'train':
        this.sectionOne.get('action')?.setValue('training');
        this.sectionOne
          .get('actionDate')
          ?.setValue(this.trainDate.nativeElement.value);
        this.setInputValues(this.sectionOne.get('actionDate')?.value, '');
        break;
      case 'getCer':
        this.sectionOne.get('action')?.setValue('getCertificate');
        this.sectionOne
          .get('actionDate')
          ?.setValue(this.getCerDate.nativeElement.value);
        this.setInputValues('', this.sectionOne.get('actionDate')?.value);
        break;
    }
  }

  edit() {
    if (this.role == 'ROLE_Admin') {
      this.AdminEditSecOne();
    } else if (this.role == 'ROLE_Personnel') {
      this.getGeneric9Data();
    } else if (this.canApprove) {
      if (
        !this.sectionTwo.invalid ||
        this.sectionTwo.get('result')?.value == 'noResult'
      ) {
        //not check value zone
        this.EditSectionTwo.comment = this.sectionTwo.get('comment')?.value;
        this.EditSectionTwo.result = this.sectionTwo.get('result')?.value;
        this.EditSectionTwo.evaluationDate = new Date().toLocaleDateString(
          'en-CA'
        );
        this.EditSectionTwo.plan = this.sectionTwo.get('plan')?.value;
        this.EditSectionTwo.cause = this.sectionTwo.get('cause')?.value;

        if (this.EditSectionTwo.result == 'pass') {
          this.EditSectionTwo.plan = '';
          this.EditSectionTwo.cause = '';
          this.saveSectionTwo(this.ResultId, this.EditSectionTwo);
        } else if (this.EditSectionTwo.result == 'fail') {
          if (
            this.EditSectionTwo.plan != '' &&
            this.EditSectionTwo.cause != ''
          ) {
            this.saveSectionTwo(this.ResultId, this.EditSectionTwo);
          } else {
            // alert('โปรดระบุ เหตุผล และ แผนการพัฒนา');
            Swal.fire({
              // title: "The Internet?",
              text: 'โปรดระบุ เหตุผล และ แผนการพัฒนา',
              icon: 'warning',
            });
            // this._snackBar.open('โปรดระบุ เหตุผล และ แผนการพัฒนา', 'ปิด', {
            //   horizontalPosition: this.horizontalPosition,
            //   verticalPosition: this.verticalPosition,
            // });
          }
        } else if (this.EditSectionTwo.result == 'noResult') {
          this.EditSectionTwo.plan = ''
          if(this.EditSectionTwo.cause != ''){
            this.saveSectionTwo(this.ResultId, this.EditSectionTwo);
          }
        }
      } else {
        // alert('กรุณาประเมินผล');
        Swal.fire({
          // title: "The Internet?",
          text: 'กรุณาประเมินผล',
          icon: 'warning',
        });
      }
    }
  }

  getGeneric9Data(): void {
    let resultID = this.ResultId;
    let UID = this.UserId;
    let resultG9: any = {
      result1: 0,
      result2: 0,
      result3: 0,
      result4: 0,
      result5: 0,
    };
    resultG9.result1 = this.sectionG9.get('resultGOne')?.value;
    resultG9.result2 = this.sectionG9.get('resultGTwo')?.value;
    resultG9.result3 = this.sectionG9.get('resultGThree')?.value;
    resultG9.result4 = this.sectionG9.get('resultGFour')?.value;
    resultG9.result5 = this.sectionG9.get('resultGFive')?.value;

    Swal.fire({
      title: 'ยืนยัน',
      text: 'คุณต้องการยืนยันบันทึกผลการประเมินหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        //fetch new data before close modal
        this.ftroj1.editGeneric9(resultID, resultG9).subscribe((res) => {
          Swal.fire({
            title: 'สำเร็จ',
            text: 'บันทึกผลการประเมินเสร็จสิ้น',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            allowEscapeKey: false,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.role == 'ROLE_Personnel') {
                //for personnel
                // this.getSectorID(UID);
                this.getFindAll(null);
                this.clearAndCloseModal();
              } else {
                // Role of approver1
                this.getFindTrainingByApproveId(UID);
                this.clearAndCloseModal();
              }
            }
          });
        });
      } else {
        //not confirm
        this.clearAndCloseModal();
      }
    });
  }

  etcSelect() {
    this.etcRadio.nativeElement.checked = true;
    this.sectionOne
      .get('budget')
      ?.setValue(this.etcDetails.nativeElement.value);
  }

  onBudeget() {
    this.etcDetails.nativeElement.value = '';
    this.onBudegetRadio.nativeElement.checked = true;
  }

  setCheckRadio(choice: string, result: string) {
    if (this.canApprove) {
      this.sectionTwo.get(`result${choice}`)?.setValue(result);
      this.resultSelect(this.calculateResult());
    }

    this.EditSectionTwo.result = this.sectionTwo.get('result')?.value;
    this.EditSectionTwo.result1 =
      this.sectionTwo.get('resultOne')?.value || null;
    this.EditSectionTwo.result2 =
      this.sectionTwo.get('resultTwo')?.value || null;
    this.EditSectionTwo.result3 =
      this.sectionTwo.get('resultThree')?.value || null;
    this.EditSectionTwo.result4 =
      this.sectionTwo.get('resultFour')?.value || null;
    this.EditSectionTwo.result5 =
      this.sectionTwo.get('resultFive')?.value || null;
    this.EditSectionTwo.result6 =
      this.sectionTwo.get('resultSix')?.value || null;
    this.EditSectionTwo.result7 =
      this.sectionTwo.get('resultSeven')?.value || null;
  }

  calculateResult() {
    let total_score = 7;
    const radioLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
    let pass = 0;
    let fail = 0;

    for (const label of radioLabels) {
      const result = this.sectionTwo.get('result' + label)?.value;

      if (result === 'pass') {
        pass++;
      } else if (result === 'fail') {
        fail++;
      }

      if (result !== 'none') {
        total_score++;
      }
    }

    if (total_score % 2 === 0 && pass >= fail) {
      return 'pass';
    } else if (total_score % 2 !== 0 && pass > fail) {
      return 'pass';
    } else if (pass == fail) {
      return 'pass';
    } else {
      return 'fail';
    }
  }

  resultSelect(result: string) {
    if (result == 'pass') {
      this.passRadio.nativeElement.checked = true;
      this.passRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('pass');
      this.failRadio.nativeElement.disabled = true;
      this.fCause.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = false;
      this.nCause.nativeElement.disabled = false;
      this.nCause.nativeElement.value = '';
      this.fCause.nativeElement.value = '';
      this.sectionTwo.get('plan')?.setValue('');
      this.sectionTwo.get('cause')?.setValue('');
    } else if (result == 'fail') {
      this.passRadio.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = false;
      this.failRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('fail');
      this.fCause.nativeElement.disabled = false;
      this.nCause.nativeElement.disabled = true;
      this.nCause.nativeElement.value = '';
      this.fCause.nativeElement.value = this.sectionTwo.get('cause')?.value;
    } else if (result == 'noResult') {
      this.passRadio.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = false;
      this.failRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('noResult');
      this.nCause.nativeElement.disabled = false;
      this.fCause.nativeElement.disabled = true;
      this.fCause.nativeElement.value = '';
      this.nCause.nativeElement.value = this.sectionTwo.get('cause')?.value;
    }
  }

  notPassSelect(selected: string) {
    this.sectionTwo.get('result')?.setValue(selected);
    if (selected == 'fail') {
      this.nCause.nativeElement.value = '';
      this.nCause.nativeElement.disabled = true;
      this.fCause.nativeElement.disabled = false;
      this.noResultRadio.nativeElement.disabled = false;
      this.failRadio.nativeElement.disabled = false;
    } else if (selected == 'noResult') {
      this.fCause.nativeElement.value = '';
      this.fCause.nativeElement.disabled = true;
      this.nCause.nativeElement.disabled = false;
      this.noResultRadio.nativeElement.disabled = false;
      this.failRadio.nativeElement.disabled = false;
      const radioLabels = [
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
      ];
      for (const label of radioLabels) {
        this.sectionTwo.get('result' + label)?.setValue(null);
      }
      this.EditSectionTwo.result1 = null;
      this.EditSectionTwo.result2 = null;
      this.EditSectionTwo.result3 = null;
      this.EditSectionTwo.result4 = null;
      this.EditSectionTwo.result5 = null;
      this.EditSectionTwo.result6 = null;
      this.EditSectionTwo.result7 = null;
    }
  }

  safeSaveDate() {
    const setDate = this.ftroj1.getDatabyId(
      this.sectionOne.get('of1_id')?.value
    );
    setDate.subscribe((res) => {
      this.saveDate = res.date;
    });
  }

  ////
  //เพิ่ม .00 ออโต้
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

      //this.sectionOne.get('fee').setValue(inputValue);
    }
  }

  invalidFeeInput: boolean = false;
  invaliddeptCodeInput: boolean = false;
  invalidempCodeInput: boolean = false;

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

  onInputKeyPressempCode(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidempCodeInput = true;
    } else {
      this.invalidempCodeInput = false;
    }
  }

  ///////pcc-dept
  pccDept: any;
  //WiseSoft Dept
  wsDept: any;
  //The Middle dept array
  dept1: any;

  //for switch option in dept selector
  company!: string;
  selectCompany(company: string) {
    this.company = company;
    this.searchForm.get('company').setValue(company);
    this.searchForm.get('dept').setValue('');
    if (company == 'PCCTH') {
      this.dept1 = this.pccDept;
    } else if (company == 'WiseSoft') {
      this.dept1 = this.wsDept;
    }
  }

  changeCompany(company: string) {
    this.company = company;
    if (company == 'pcc') {
      this.dept1 = this.pccDept;
      //clear val dept pcc select
      this.sectionOne.get('dept')?.setValue('');
      this.sectionOne.get('deptCode')?.setValue('');
    } else if (company == 'ws') {
      this.dept1 = this.wsDept;
      //cleat val dept ws select
      this.sectionOne.get('dept')?.setValue('');
      this.sectionOne.get('deptCode')?.setValue('');
    }
  }

  deptCode!: any;
  // Function to update department code when a department is selected
  updateDeptCode() {
    const selectedDept = this.sectionOne.get('dept')?.value;

    // Find the selected department object based on its name
    const selectedDeptObject = this.dept1.find(
      (dept: any) => dept.name === selectedDept
    );

    // Update the department code field
    if (selectedDeptObject) {
      this.deptCode = selectedDeptObject.code;
    } else {
      this.deptCode = '';
    }
  }
  alldeptManage: any;
  filterPccDept: any;
  filterWsDept: any;
  filterDept(id: number) {
    this.ftroj1.getAlldeptWithAdmin(id).subscribe((response) => {
      let res = response[0];
      let pccdata = res?.filter((item: any) => item.company == 'PCCTH');
      let pccDept = pccdata[0]?.sectors;

      let wsdata = res?.filter((item: any) => item.company == 'WiseSoft');

      let wsDept = wsdata[0]?.sectors;

      wsDept = wsDept?.map((item: any) => item?.departments).flat();

      pccDept = pccDept?.map((item: any) => item?.departments).flat();
      this.filterPccDept = pccDept || null;
      this.filterWsDept = wsDept || null;
      this.initDept();
    });
  }

  initDept() {
    this.ftroj1.getAlldeptWithCompanyV2().subscribe(
      (res) => {
        let pccDept = res.filter((dept: any) => dept.company === 'PCCTH');
        let wsDept = res.filter((dept: any) => dept.company === 'WiseSoft');
        //const filteredData = data.filter(item => filterIds.includes(item.department.id));
        if (this.role != 'ROLE_Personnel') {
          const filterPCCDept = pccDept.filter((item: any) =>
            this.filterPccDept?.some(
              (filter: any) => filter.deptid == item.department.id
            )
          );
          const filterWSDept = wsDept.filter((item: any) =>
            this.filterWsDept?.some(
              (filter: any) => filter.deptid == item.department.id
            )
          );
          pccDept = filterPCCDept;
          wsDept = filterWSDept;
        }

        this.pccDept = pccDept;
        this.wsDept = wsDept;
        this.selectCompany('');
      },
      (err) => {
        console.error(err);
      }
    );
  }

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  onSubmit() {
    const selectedCompany = this.searchForm.get('company')?.value;
    const selectedDept = this.searchForm.get('department')?.value;

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
      this.searchForm.get('department')?.setValue('');
    }
  }

  TrainID: number = 0;
  openViewModeAdmin(id: number) {
    // this.toggleModal();
    this.TrainID = id;
    // ตั้งค่าฟิลด์ให้ไม่สามารถแก้ไขได้
    this.ApproveView(id);
    this.sectionTwo.disable();
  }

  EditSectionTwo: EditSectionTwo = {
    cause: '',
    comment: '',
    evaluationDate: '',
    plan: '',
    result: '',
    result1: '',
    result2: '',
    result3: '',
    result4: '',
    result5: '',
    result6: '',
    result7: '',
  };
  ResultId = 0;
  isEval: string | null = null;
  ApproveView(id: number) {
    this.headerModal = ' FTR-OF1 : แบบฟอร์มการส่งพนักงานเข้ารับการฝึกอบรม';

    // this.sectionTwo.enable();
    this.g9modal = false;
    this.toggleModal();
    this.TrainID = id;
    this.ftroj1.findTrainingByTrainID(id).subscribe(async (res) => {
      // const response = Object(res)[0]
      this.statusID = res.training.status[0].id;

      this.approveStatus = res.result_status;
      this.ResultId = res.training.result[0].id;

      this.genEvalatorData(res.training.approve1.id);
      this.approve_id = res.training.approve1.id;

      this.isEval = res.training.result[0].result;

      this.EditSectionTwo.evaluationDate =
        res.training.result[0].evaluationDate;
      //กรณีมีการประเมินแล้วก็ให้โชว์

      if (this.UserId == res.training.approve1.id) {
        this.sectionTwo.enable();
        this.canApprove = true;
      } else {
        this.sectionTwo.disable();
        this.canApprove = false;
      }

      if (res.training.result[0].result != null) {
        this.sectionTwo
          .get('comment')
          ?.setValue(res.training.result[0].comment);
        this.sectionTwo.get('plan')?.setValue(res.training.result[0].plan);
        this.sectionTwo
          .get('resultOne')
          ?.setValue(res.training.result[0].result1);
        this.sectionTwo
          .get('resultTwo')
          ?.setValue(res.training.result[0].result2);
        this.sectionTwo
          .get('resultThree')
          ?.setValue(res.training.result[0].result3);
        this.sectionTwo
          .get('resultFour')
          ?.setValue(res.training.result[0].result4);
        this.sectionTwo
          .get('resultFive')
          ?.setValue(res.training.result[0].result5);
        this.sectionTwo
          .get('resultSix')
          ?.setValue(res.training.result[0].result6);
        this.sectionTwo
          .get('resultSeven')
          ?.setValue(res.training.result[0].result7);
        this.sectionTwo.get('cause')?.setValue(res.training.result[0].cause);
        if (res.training.result[0].result != null) {
          this.sectionTwo
            .get('result')
            ?.setValue(res.training.result[0].result);
          this.resultSelect(res.training.result[0].result);

          // if(this.sectionOne.get('result')?.value !== 'pass'){
          //   this.passRadio.nativeElement.disabled = true;
          // }
        }

        this.EditSectionTwo.result = res.training.result[0].result;
        this.EditSectionTwo.result1 = res.training.result[0].result1 || '';
        this.EditSectionTwo.result2 = res.training.result[0].result2 || '';
        this.EditSectionTwo.result3 = res.training.result[0].result3 || '';
        this.EditSectionTwo.result4 = res.training.result[0].result4 || '';
        this.EditSectionTwo.result5 = res.training.result[0].result5 || '';
        this.EditSectionTwo.result6 = res.training.result[0].result6 || '';
        this.EditSectionTwo.result7 = res.training.result[0].result7 || '';
      }
    });
  }

  canApprove = false;
  genEvalatorData(id: number) {
    this.ftroj1.getUserById(id).subscribe((res) => {
      this.sectionTwo
        .get('evaluatorName')
        ?.setValue(
          res.responseData.result.firstname +
            ' ' +
            res.responseData.result.lastname
        );
      this.sectionTwo
        .get('evaluatorRole')
        ?.setValue(res.responseData.result.position.positionName);
      this.sectionTwo
        .get('evaluatorDept')
        ?.setValue(res.responseData.result.departments[0].deptName);
      this.sectionTwo
        .get('evaluatorSector')
        ?.setValue(res.responseData.result.sectors[0].sectorName);
    });
  }

  openViewModeUser(id: number) {
    // this.toggleModal();
    this.TrainID = id;
    // ตั้งค่าฟิลด์ให้ไม่สามารถแก้ไขได้
    // this.sectionOne.disable();
    this.ApproveView(id);
    this.sectionTwo.disable();

    // ตั้งค่าค่าอื่น ๆ ตามที่คุณต้องการ
    this.showEditButton = true;

    // คำสั่งอื่น ๆ ที่คุณต้องการในโหมดดูข้อมูล
  }

  EditSectionOneForm: EditSectionOne = {
    action: '',
    actionDate: '',
    approve1_id: 0,
    courseId: 0,
    dateSave: '',
    day: 0,
    userId: 0,
    budget: 0,
    approve2_id: 0,
    approve3_id: 0,
    approve4_id: 0,
    fileID: [0],
  };
  nonInbuget = false;
  onbudgetCheck(check: boolean) {
    this.nonInbuget = check;
  }
  secOneChangeValue(sectionOne: EditSectionOne) {
    this.EditSectionOneForm = sectionOne;
  }
  statusID = 0;
  async AdminEditSecOne() {
    await this.uploadAndPushFileID();
    let fileID = this.EditSectionOneForm.fileID || [0];
    let filesID = this.filesID || [0];
    let adminId = this.UserId || 0;
    let combinedFileID = Array.from(new Set([...fileID, ...filesID]));

    if (!combinedFileID || combinedFileID.length === 0) {
      combinedFileID = [0];
    }
    let adminEditData = {
      userId: this.EditSectionOneForm.userId,
      dateSave: new Date().toLocaleDateString('en-CA'),
      day: this.EditSectionOneForm.day,
      action: this.EditSectionOneForm.action,
      actionDate: this.EditSectionOneForm.actionDate,
      courseId: this.EditSectionOneForm.courseId,
      approve1_id: this.EditSectionOneForm.approve1_id,
      approve2_id: this.EditSectionOneForm.approve2_id,
      approve3_id: this.EditSectionOneForm.approve3_id,
      approve4_id: this.EditSectionOneForm.approve4_id,
      budget: this.EditSectionOneForm.budget,
      fileID: combinedFileID,
    };

    Swal.fire({
      title: 'แก้ไข',
      text: 'คุณต้องการแก้ไขข้อมูลหรือไม่',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        //confirm edit
        this.ftroj1
          .EditSectionOne(this.TrainID, adminEditData)
          .subscribe(async (res) => {
            await this.getFindAll(this.alldeptManage);
            Swal.fire({
              title: 'สำเร็จ',
              text: 'แก้ไขข้อมูลสำเร็จ',
              icon: 'success',
              confirmButtonText: 'ตกลง',
            }).then((result) => {
              if (result.isConfirmed) {
                //fetch data by admin
              }
              this.clearAndCloseModal();
            });
          });
      } else {
        // not confirm edit
        this.clearAndCloseModal();
      }
    });
  }

  checkIfCancelAllowed(user: {
    result_status: string;
    training: { status: any[] };
  }): boolean {
    return (
      user.result_status !== 'ยกเลิก' &&
      !user.training.status.some(
        (status) => status.status === '' || status.status === 'ไม่อนุมัติ'
      )
    );
  }

  checkIfConfirmStatus(user: { training: { status: any[] } }): boolean {
    return !user.training.status.some((status) => status.status === 'อนุมัติ');
  }

  signatureBlob: Blob | null = null;
  signatureImageUrlManager: SafeUrl | null = null;
  signatureImageUrlApprover: SafeUrl | null = null;
  signatureImageUrlVice: SafeUrl | null = null;
  signatureImageUrlMD: SafeUrl | null = null;
  // userId: number = 0; // หรือค่าเริ่มต้นที่ไม่ใช่ null
  users: any;
  userIdVice: number = 0;
  userIdApprover: number = 0;
  userIdManager: number = 0;
  userIdMD: number = 0;

  onUserIdSelected(userId: number | null, position: string) {
    if (userId !== null && userId !== 0) {
      this.loadSignatureImage(userId, position);
    }
  }

  loadSignatureImage(userId: number, position: string): void {
    this.signatureService.getSignatureImage(userId).subscribe(
      (imageBlob: Blob) => {
        this.signatureBlob = imageBlob;
        if (imageBlob.size > 0) {
          const url = URL.createObjectURL(imageBlob);
          if (position == 'Manager') {
            this.signatureImageUrlManager = null;
            this.signatureImageUrlManager =
              this.sanitizer.bypassSecurityTrustUrl(url);
            this.userIdManager = userId;
          } else if (position == 'Approver') {
            this.signatureImageUrlApprover = null;
            this.signatureImageUrlApprover =
              this.sanitizer.bypassSecurityTrustUrl(url);
            this.userIdApprover = userId;
          } else if (position == 'Vice') {
            this.signatureImageUrlVice = null;
            this.signatureImageUrlVice =
              this.sanitizer.bypassSecurityTrustUrl(url);
            this.userIdVice = userId;
          } else if (position == 'MD') {
            this.signatureImageUrlMD = null;
            this.signatureImageUrlMD =
              this.sanitizer.bypassSecurityTrustUrl(url);
            this.userIdMD = userId;
          }
        } else {
          if (position == 'Manager') {
            this.signatureImageUrlManager = null; // แก้ไขที่นี่
            this.userIdManager = 0;
          } else if (position == 'Approver') {
            this.signatureImageUrlApprover = null;
            this.userIdApprover = 0;
          } else if (position == 'Vice') {
            this.signatureImageUrlVice = null;
            this.userIdVice = 0;
          } else if (position == 'MD') {
            this.signatureImageUrlMD = null;
            this.userIdMD = 0;
          }
        }
      },
      (error) => {
        if (error.status === 404) {
          if (position == 'Manager') {
            this.signatureImageUrlManager = null;
            this.signatureForm.get('userId1')?.setValue('');
            this.userIdManager = 0;
          } else if (position == 'Approver') {
            this.signatureImageUrlApprover = null;
            this.signatureForm.get('userId4')?.setValue('');
            this.userIdApprover = 0;
          } else if (position == 'Vice') {
            this.signatureImageUrlVice = null;
            this.signatureForm.get('userId2')?.setValue('');
            this.userIdVice = 0;
          } else if (position == 'MD') {
            this.signatureImageUrlMD = null;
            this.signatureForm.get('userId3')?.setValue('');
            this.userIdMD = 0;
          }
          // alert('ยังไม่เพิ่มลายเซ็น');
          Swal.fire({
            // title: "The Internet?",
            text: 'ยังไม่เพิ่มลายเซ็น',
            icon: 'warning',
          });
          // this._snackBar.open('ยังไม่เพิ่มลายเซ็น', 'ปิด', {
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        } else {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'เกิดข้อผิดพลาดในการเข้าถึงข้อมูล',
            icon: 'error',
          });
        }
      }
    );
  }

  loadAllUsers() {
    this.signatureService
      .findAllVicePresidentAndApprover()
      .subscribe((viceandapprovers) => {
        this.users = viceandapprovers;
      });
  }

  Signature = false;
  approve1: any = [];
  vicePresidents: any = [];
  signatureParams: any = {};
  async printReport(id: number) {
    // this.signatureForm.reset()
    this.signatureParams = {};
    let training = this.allParentsResult.filter((items: any) => {
      return items.training.id == id;
    });
    let SignatureDetails = training[0].training.status;
    this.signatureParams.trainId = training[0].training.id;
    for (let index = 0; index < SignatureDetails.length; index++) {
      let position = SignatureDetails[index].indexOfSignature;
      let UID = SignatureDetails[index].approveId.id;
      this.initsignature(UID, position);
    }
    this.printFormValues();
  }

  private initsignature(userid: number, position: number) {
    switch (position) {
      case 1:
        this.signatureParams.userId4 = userid;
        break;
      case 2:
        this.signatureParams.userId1 = userid;
        break;
      case 3:
        this.signatureParams.userId2 = userid;
        break;
      case 4:
        this.signatureParams.userId3 = userid;
        break;
    }
  }

  PdfWithSignature(id: number) {
    this.approve1 = [];
    this.vicePresidents = [];

    let training = this.allParentsResult.filter((items: any) => {
      return items.training.id == id;
    });

    let dept_id = training[0].training.approve1.departments[0].id;

    this.vicePresidents = this.users.filter((items: any) => {
      return (
        items.departments.some((dept: any) =>
          this.alldeptManage.some((filterDept: any) => filterDept.id == dept.id)
        ) && items.roles[0].role == 'VicePresident'
      );
    });
    this.approve1.push(training[0].training.approve1);

    this.Signature = !this.Signature;
    this.TrainID = id;
    this.signatureForm.get('trainId')?.setValue(id);
  }

  closeModal() {
    this.Signature = false;

    this.signatureForm = this.fb.group({
      trainId: '', // ใช้ TrainID เป็นค่าเริ่มต้น
      userId1: '', // คุณสามารถกำหนดค่า default ให้กับ control ได้ที่นี่
      userId2: '',
      userId3: '',
      userId4: '',
    });
    this.signatureImageUrlManager = null;
    this.signatureImageUrlApprover = null;
    this.signatureImageUrlVice = null;
    this.signatureImageUrlMD = null;
  }

  clearuser(no: number) {
    this.signatureForm.get(`userId${no}`)?.setValue('');
    switch (no) {
      case 1:
        this.signatureImageUrlManager = null;
        break;
      case 4:
        this.signatureImageUrlApprover = null;
        break;
      case 2:
        this.signatureImageUrlVice = null;
        break;
      case 3:
        this.signatureImageUrlMD = null;
        break;
      default:
        break;
    }
  }

  printFormValues() {
    this.showLoading();
    this.ftroj1.getReport(this.signatureParams).subscribe(
      (base64Pdf) => {
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
        setTimeout(() => {
          Swal.close();
        }, 6000);
        this.signatureForm.reset(); //reset all signature
      },
      (err) => {
        console.error(err);
        if (
          err.error.message ==
          'java.lang.NullPointerException: Cannot invoke "com.pcc.portalservice.model.Signature.getImage()" because the return value of "com.pcc.portalservice.model.User.getSignature()" is null'
        ) {
          //wait err text handle from back-end
          Swal.fire({
            title: 'ไม่สำเร็จ',
            text: 'กรุณาเพิ่มลายเซ็น ไม่พบรายเซ็นในระบบ',
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'ไม่สำเร็จ',
            text: 'เกิดข้อผิดพลาดในการพิมพ์รายงาน',
            icon: 'error',
          });
        }
        this.signatureForm.reset(); //reset all signature
      }
    );
  }

  selectedStatus: any;
  allFilterParentsResult: any;
  filterStatus() {
    let hasData = false; // ประกาศตัวแปรเพื่อตรวจสอบว่ามีข้อมูลหลังการกรองหรือไม่
    this.filterMode = true;
    if (this.selectedStatus == 'allApprove') {
      if (this.role === 'ROLE_Admin' || this.role === 'ROLE_Personnel') {
        let data = this.allParentsResult.filter((item: any) => {
          return item.result_status.trim() === 'อนุมัติ';
        });
        this.allFilterParentsResult = data;
        this.parentResult = this.allFilterParentsResult.slice(0, 3);
        if (data.length > 0) {
          hasData = true;
        }
      } else {
        let data = this.allParentsResult.filter((item: any) => {
          return item.isDo.trim() === 'อนุมัติ';
        });
        this.allFilterParentsResult = data;
        this.parentResult = this.allFilterParentsResult.slice(0, 3);
        hasData = false;

        if (data.length > 0) {
          hasData = true;
        }
      }
    } else if (this.selectedStatus == 'waitApprove') {
      if (this.role === 'ROLE_Admin' || this.role === 'ROLE_Personnel') {
        let data = this.allParentsResult.filter((item: any) => {
          return item.result_status.trim() === 'รอประเมิน';
        });
        this.allFilterParentsResult = data;
        this.parentResult = this.allFilterParentsResult.slice(0, 3);
        hasData = false;

        if (data.length > 0) {
          hasData = true;
        }
      } else {
        let data = this.allParentsResult.filter((item: any) => {
          return (
            item.isDo.trim() !== 'อนุมัติ' && item.result_status === 'รอประเมิน'
          );
        });
        this.allFilterParentsResult = data;
        this.parentResult = this.allFilterParentsResult.slice(0, 3);
        hasData = false;

        if (data.length > 0) {
          hasData = true;
        }
      }
    } else if (this.selectedStatus == 'waitEval') {
      if (
        this.role == 'ROLE_VicePresident' ||
        this.role == 'ROLE_Approver' ||
        this.role == 'ROLE_Manager' ||
        this.role == 'ROLE_President'
      ) {
        let data = this.allParentsResult.filter((item: any) => {
          const dafaultCheck =
            item.training.approve1.id == this.UserId &&
            item.training.result[0].result === null &&
            item.result_status === 'อนุมัติ';

          const g9check =
            item.training.resultGeneric9[0].result1 === null &&
            item.result_status === 'อนุมัติ' &&
            item.training.approve1.id == this.UserId;
          return dafaultCheck || g9check;
        });

        if (data.length > 0) {
          this.allFilterParentsResult = data;
          this.parentResult = this.allFilterParentsResult.slice(0, 3);
          hasData = true;
        } else {
          this.allFilterParentsResult = [];
          this.parentResult = [];
        }
      } else {
        let data = this.allParentsResult.filter((item: any) => {
          const dafaultCheck =
            item.training.approve1.id == this.UserId &&
            item.training.result[0].result === null &&
            item.result_status === 'อนุมัติ';

          const g9check =
            item.training.resultGeneric9[0].result1 === null &&
            item.result_status === 'อนุมัติ';
          return dafaultCheck || g9check;
        });
        this.allFilterParentsResult = data;
        this.parentResult = this.allFilterParentsResult.slice(0, 3);
        hasData = false;

        if (data.length > 0) {
          hasData = true;
        }
      }
    } else if (this.selectedStatus == 'Eval') {
      let data = this.allParentsResult.filter((item: any) => {
        const dafaultCheck =
          item.training.approve1.id == this.UserId &&
          item.training.result[0].result !== null &&
          item.result_status === 'อนุมัติ';

        const g9check =
          item.training.resultGeneric9[0].result1 !== null &&
          item.result_status === 'อนุมัติ';
        return dafaultCheck || g9check;
      });
      this.allFilterParentsResult = data;
      this.parentResult = this.allFilterParentsResult.slice(0, 3);
      hasData = false;

      if (data.length > 0) {
        hasData = true;
      }
    } else if (this.selectedStatus == 'All') {
      this.allFilterParentsResult = this.allParentsResult;
      this.parentResult = this.allFilterParentsResult.slice(0, 3);
      hasData = false;
      if (this.parentResult.length > 0) {
        hasData = true;
      }
    }
    this.pageLength = this.allFilterParentsResult.length; // กำหนดขนาดให้ paginator ขณะ filter

    // ตรวจสอบว่าไม่มีข้อมูลหลังการกรอง
    if (!hasData) {
      this.showErrorMessage = true; // ไม่พบข้อมูล
    } else {
      this.showErrorMessage = false; // มีข้อมูล
    }
  }

  unapprovedCount: number = 0;
  unEvalCount: number = 0;

  notiStatus() {
    this.unapprovedCount = this.allParentsResult.filter((item: any) => {
      return (
        item.isDo.trim() !== 'อนุมัติ' && item.result_status === 'รอประเมิน'
      );
    }).length;

    this.unEvalCount = this.allParentsResult.filter((item: any) => {
      return (
        item.isDoResult === 'ใช่' && item.training.result[0].result === null
      );
    }).length;
  }

  form: any;
  sectors: any;
  initsector() {
    this.ftroj1.getAllSector().subscribe((res: any) => {
      this.sectors = res;
    });
  }

  private getCourseID(): any {
    let allCourse = this.courseData.concat(this.testData);
    let course_id = allCourse.filter((item: any) => {
      return item.courseName == this.searchForm.value.courseName;
    });
    return course_id[0].id;
  }

  generic() {
    this.showLoading();
    let params: any = {};
    let deptname = this.searchForm?.value?.dept;
    let filteredDepts = this.dept1?.filter(
      (item: any) => item.department?.deptName == deptname
    );
    let filteredSectors = this.sectors.filter(
      (item: any) => item.sectorName == filteredDepts[0]?.sectorName
    );
    let sector = filteredSectors[0]?.sectorName;

    //declare value
    if (this.searchForm.value.startDate && this.searchForm.value.endDate) {
      params.startDate = this.searchForm?.value?.startDate;
      params.endDate = this.searchForm?.value?.endDate;
    }
    if (this.searchForm.value.dept) {
      params.deptID = filteredDepts[0]?.department?.id;
      if (this.company == 'PCCTH' && sector == 'SD') {
        params.sectorID = filteredSectors[0]?.id;
      } else if (this.company == 'WiseSoft' && sector == 'SD') {
        params.sectorID = filteredSectors[1]?.id;
      } else {
        params.sectorID = filteredSectors[0]?.id;
      }
    }
    if (this.searchForm.value.courseName) {
      params.courseID = this.getCourseID();
    }

    this.ftroj1.ReportHistoryTraining(params).subscribe((base64) => {
      if (base64 == 'ไม่มีข้อมูล') {
        // alert("ไม่มีข้อมูล");
        Swal.close();
        Swal.fire({
          // title: "The Internet?",
          text: 'ไม่มีข้อมูล',
          icon: 'warning',
        });
        // this._snackBar.open('ไม่มีข้อมูล', 'ปิด', {
        //   horizontalPosition: this.horizontalPosition,
        //   verticalPosition: this.verticalPosition,
        // });
        return;
      }
      const byteCharacters = atob(base64);
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
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'ดาวน์โหลดไฟล์สำเร็จ',
        icon: 'success',
      });
      Swal.close();
    });
  }

  data: string | undefined;
  downloadLink: string = ''; // ตัวแปรสำหรับเก็บลิงก์สำหรับดาวน์โหลด

  generic9EVO() {
    this.showLoading();
    const params: any = {};

    if (this.searchForm.value.startDate) {
      params.startDate = this.searchForm.value.startDate;
    }

    if (this.searchForm.value.endDate) {
      params.endDate = this.searchForm.value.endDate;
    }

    if (this.searchForm.value.courseName) {
      params.courseId = this.getCourseID();
    }

    this.ftroj1.generic9EVO(params).subscribe(
      (res) => {
        if (
          res.PCC_Jasper === 'ไม่มีข้อมูล' &&
          res.Wisesoft_Jasper === 'ไม่มีข้อมูล'
        ) {
          Swal.close();
          Swal.fire({
            // title: "The Internet?",
            text: 'ไม่มีข้อมูล',
            icon: 'warning',
          });
          // this._snackBar.open('ไม่มีข้อมูล', 'ปิด', {
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        } else {
          let base64 = null;
          if (this.company === 'PCCTH') {
            base64 = res.PCC_Jasper;
          } else if (this.company === 'WiseSoft') {
            base64 = res.Wisesoft_Jasper;
          }
          let filename = `generic9_ยื่นกรมพัฒนาฝีมือแรงงาน(${new Date().toLocaleDateString(
            'th-TH'
          )}).xlsx`;
          this.data = base64;

          // ดาวน์โหลดไฟล์เมื่อมีข้อมูลพร้อมใช้งานแล้ว
          const downloadLink = document.createElement('a');
          downloadLink.href =
            'data:application/octet-stream;base64,' + this.data;
          downloadLink.download = filename;
          downloadLink.click();
          Swal.close();
          Swal.fire({
            title: 'สำเร็จ!',
            text: 'ดาวน์โหลดไฟล์สำเร็จ',
            icon: 'success',
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  //  data = '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';

  selectedTrainId: any;

  showModal2 = false;

  toggleModal2() {
    this.showModal2 = !this.showModal2;
  }

  openConfirmationModal(id: number): void {
    Swal.fire({
      title: 'ยกเลิก?',
      text: 'คุณต้องการยกเลิกการอบรมนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยกเลิก',
      cancelButtonText: 'ไม่ยกเลิก',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'ยกเลิกเสร็จสิ้น',
          text: 'การอบรมนี้ถูกยกเลิกแล้ว',
          icon: 'success',
        });
        this.cancelTrain(id);
      }
    });
  }

  headerModal!: string;
  g9modal = false;
  G9modal(id: number) {
    // this.ResultId = id;
    this.headerModal = ' Generic 9 : ยื่นกรมพัฒนาฝีมือแรงงาน กระทรวงแรงงาน';
    this.g9modal = true; // show only g9 modal
    this.ftroj1.findTrainingByTrainID(id).subscribe((res) => {
      this.ResultId = res.training.resultGeneric9[0].id;
      this.sectionG9
        .get('resultGOne')
        ?.setValue(res.training.resultGeneric9[0].result1);
      this.sectionG9
        .get('resultGTwo')
        ?.setValue(res.training.resultGeneric9[0].result2);
      this.sectionG9
        .get('resultGThree')
        ?.setValue(res.training.resultGeneric9[0].result3);
      this.sectionG9
        .get('resultGFour')
        ?.setValue(res.training.resultGeneric9[0].result4);
      this.sectionG9
        .get('resultGFive')
        ?.setValue(res.training.resultGeneric9[0].result5);
      if (this.UserId == res.training.approve1.id) {
        this.sectionTwo.enable();
        this.canApprove = true;
      } else {
        this.sectionTwo.disable();
        this.canApprove = false;
      }
    });
    this.showModal = true; // open modal
  }

  setCheckRadioG9(number: any, value: any) {
    if (this.role == 'ROLE_Admin' || this.role == 'ROLE_User') {
      // this.sectionG9.get(`resultG${number}`)?.setValue(value)
    } else {
      this.sectionG9.get(`resultG${number}`)?.setValue(value);
    }
  }

  gettedFiles: File[] = [];
  filesID: Number[] = [];
  getfilesOutput(files: File[]) {
    this.gettedFiles = files;
  }

  async uploadAndPushFileID() {
    if (this.gettedFiles.length) {
      for (const file of this.gettedFiles) {
        try {
          const response: any = await this.ftroj1.uploadFile(file).toPromise();

          this.filesID.push(response.ID);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      this.gettedFiles = [];
    } else {
      console.error('No files selected.');
      // this.filesID = [0]
    }
  }

  infoReportAdmin() {
    Swal.fire({
      title: 'คำแนะนำ',
      html: `
      <h6><b>วิธีการพิมพ์ประวัติฝึกอบรม</b></h6>
      <div>
        <p class="text-left"><b>ตัวเลือกที่ 1</b> เลือก บริษัท วันที่เริ่ม วันที่สิ้นสุด และ แผนก </p>
        <p class="text-left"><b>ตัวเลือกที่ 2</b> เลือก บริษัท วันที่เริ่ม วันที่สิ้นสุด แผนก และ หัวข้อในการอบรม</p>
      </div>
      `,
    });
  }

  infoReportPersonnel() {
    Swal.fire({
      title: 'คำแนะนำ',
      html: `
      <h6><b>วิธีการพิมพ์ประวัติฝึกอบรม</b></h6>
      <div>
        <p class="text-left"><b>ตัวเลือกที่ 1</b> เลือก บริษัท และ หัวข้อในการอบรม</p>
        <p class="text-left"><b>ตัวเลือกที่ 2</b> เลือก บริษัท วันที่เริ่ม และ วันที่สิ้นสุด </p>
        <p class="text-left"><b>ตัวเลือกที่ 3</b> เลือก บริษัท วันที่เริ่ม วันที่สิ้นสุด และ หัวข้อในการอบรม</p>
        <p class="text-left"><b>ตัวเลือกที่ 4</b> เลือก บริษัท วันที่เริ่ม วันที่สิ้นสุด และ แผนก</p>
        <p class="text-left"><b>ตัวเลือกที่ 5</b> เลือก บริษัท วันที่เริ่ม วันที่สิ้นสุด หัวข้อในการอบรม และ แผนก</p>
      </div>
      <hr/>
      <h6><b>วิธีการพิมพ์ผลการประเมิน Generic9</b></h6>
      <div>
      <p class="text-left"><b>ตัวเลือกที่ 1</b>เลือก บริษัท วันที่เริ่ม วันที่สิ้นสุด และ หัวข้อในการอบรม</p>
      </div>
      `,
    });
  }

  clearAndCloseModal() {
    //clear and close form in modal
    this.ResultId = 0;
    this.TrainID = 0;
    this.sectionOne.reset();
    this.sectionTwo.reset();
    this.sectionG9.reset();
    this.showModal = false;
  }

  private saveSectionTwo(resultId: number, sectionTwo: any) {
    Swal.fire({
      title: 'ยืนยัน',
      text: 'ยืนยันที่จะบันทึกผลการประเมินหริอไม่?',
      icon: 'warning',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let userId = this.UserId;
        this.ftroj1.EditSectionTwo(resultId, sectionTwo).subscribe((res) => {
          Swal.fire({
            title: 'สำเร็จ',
            text: 'บันทึกผลการประเมินเสร็จสิ้น',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            allowEscapeKey: false,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              //fetch training of approver id
              this.getFindTrainingByApproveId(userId);
              this.clearAndCloseModal();
            }
          });
        });
      } else {
        this.clearAndCloseModal();
      }
    });
  }
}

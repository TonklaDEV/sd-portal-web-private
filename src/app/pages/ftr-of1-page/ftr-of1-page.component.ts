import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/api-services/auth.service';
import { FtrOf1Service } from 'src/app/api-services/ftr-of1.service';
import {
  Course,
  CreateSectionOne,
  EditSectionOne,
  Employee,
  listEmp,
} from 'src/environments/interfaces/environment-options.interface';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ftr-of1-page',
  templateUrl: './ftr-of1-page.component.html',
  styleUrls: ['./ftr-of1-page.component.scss'],
})
export class FtrOf1PageComponent implements OnInit, AfterViewInit {
  @Input() trainID: number = 0;

  @ViewChild('picker') picker!: ElementRef;
  @ViewChild('textInput') textInput!: ElementRef;

  updateTextInputValue() {
    const pickerValue = this.picker.nativeElement.value; // ดึงค่าจาก #picker
    this.textInput.nativeElement.value = pickerValue; // กำหนดค่าใน <input>
  }
  //company selected
  @ViewChild('pccSelected') pccSelected!: ElementRef<HTMLInputElement>;
  @ViewChild('wsSelected') wsSelected!: ElementRef<HTMLInputElement>;

  //snacknbar postion
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  sectionOne: FormGroup;
  sectionTwo: any;
  // กำหนดค่าเริ่มต้นของ CreateFormSectionOne โดยใช้ CreateSectionOne
  CreateFormSectionOne: CreateSectionOne = {
    userId: 0, // ตั้งค่า userId ตามความเหมาะสม
    dateSave: '', // ตั้งค่า dateSave ตามความเหมาะสม
    day: 0, // ตั้งค่า day ตามความเหมาะสม
    courseId: 0, // ตั้งค่า courseId ตามความเหมาะสม
    action: '', // ตั้งค่า action ตามความเหมาะสม
    actionDate: '', // ตั้งค่า actionDate ตามความเหมาะสม
    approve1_id: 0, // ตั้งค่า approve1_id ตามความเหมาะสม // ตั้งค่า status1 ตามความเหมาะสม
    approve2_id: 0, // ตั้งค่า approve1_id ตามความเหมาะสม // ตั้งค่า status1 ตามความเหมาะสม
    approve3_id: 0, // ตั้งค่า approve1_id ตามความเหมาะสม // ตั้งค่า status1 ตามความเหมาะสม
    approve4_id: 0, // ตั้งค่า approve1_id ตามความเหมาะสม // ตั้งค่า status1 ตามความเหมาะสม
    budget: 0,
    fileID: [0],
  };

  @ViewChild('empCodeEl') empCodeEl!: ElementRef<HTMLInputElement>;
  @ViewChild('fCause') fCause!: ElementRef<HTMLInputElement>;
  @ViewChild('nCause') nCause!: ElementRef<HTMLInputElement>;
  @ViewChild('budgetRadio') budgetRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('etcRadio') etcRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('etcDetails') etcDetails!: ElementRef<HTMLInputElement>;
  @ViewChild('passRadio') passRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('failRadio') failRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('noResultRadio') noResultRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('trainingRadio') trainingRadio!: ElementRef<HTMLInputElement>;
  // @ViewChild('getResultRadio') getResultRadio!: ElementRef<HTMLInputElement>;
  // @ViewChild('testRadio') testRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('getCertificateRadio')
  getCertificateRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('trainingDate') trainingDate!: ElementRef<HTMLInputElement>;
  // @ViewChild('getResultDate') getResultDate!: ElementRef<HTMLInputElement>;
  // @ViewChild('testDate') testDate!: ElementRef<HTMLInputElement>;
  @ViewChild('getCertificateDate')
  getCertificateDate!: ElementRef<HTMLInputElement>;
  notPass: Boolean = false;

  startDate!: Date;
  endDate!: Date;
  showAlert: boolean = false;

  //for switch option in dept selector
  company: string = 'PCCTH';

  topic_ojt!: string;
  topic_date!: string;
  topic_location!: string;
  topic_inst!: string;
  //topic dataset

  course!: any;

  //paginator variable
  pageLength = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  initCourse(type: string) {
    this.service.getCourse(type).subscribe(
      (res) => {
        this.course = res;
        // console.log('init couse');

        // console.log(res);
      },
      (error) => {
        console.error('Error while get data: ', error);
      }
    );
  }

  course_id!: number;

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    return `${year}-${month}-${day}`;
  }

  //employee data set
  employees!: string[];

  empobject!: any;

  async onclickEmp() {
    this.filteredOptions = this.empNameCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }
  wsEmployee!: Employee[];
  pccEmployee!: Employee[];
  centerEmployee!: Employee[];
  Allemps!: any;
  async initEmp() {
    try {
      let res = await this.service.getActiveEmp().toPromise();
      this.Allemps = res;
      let EmpOnly = res;
      // .filter((item: any) => {
      //   return item.roles.some((item: any) => item.role == 'User');
      // });
      let wsEmp: Employee[] = EmpOnly.filter((item: any) => {
        return item.companys.some(
          (companys: any) => companys.companyName == 'WiseSoft'
        );
      });
      let pccEmp: Employee[] = EmpOnly.filter((item: any) => {
        return item.companys.some(
          (companys: any) => companys.companyName == 'PCCTH'
        );
      });
      this.wsEmployee = wsEmp;
      this.pccEmployee = pccEmp;

      this.AllApproves = res.filter((emp: any) => {
        return emp.roles.some(
          (item: any) =>
            item.role == 'Approver' ||
            item.role == 'VicePresident' ||
            item.role == 'Manager' ||
            item.role == 'President'
        );
      });
    } catch (error) {
      console.error('Error while fetching employees', error);
    }
  }

  filterNamesByDeptCode(deptCode: string, userDataArray: Employee[]): string[] {
    // กรองข้อมูลโดยใช้ deptCode ที่รับเข้ามา
    let filteredData = userDataArray.filter((emp) => {
      // console.log(emp);
      if (emp.departments[0] != null) {
        const hasValidRole =
          emp.roles && emp.roles.length > 0 && emp.roles[0].role === 'User';
        const hasValidDept = emp.departments[0].deptCode === deptCode;
        return hasValidDept && hasValidRole;
      }
      return;
    });

    // สร้าง array ใหม่ที่มีแต่ชื่อ นามสกุล
    const namesArray: string[] = filteredData.map(
      (user) => `${user.firstname} ${user.lastname}`
    );

    return namesArray;
  }

  empCode: string = '';
  empPosition: string = '';
  empName: string = '';
  empId_Table!: number;
  genEmpdata() {
    // console.log('gen emp ');
    // console.log(this.pccEmployee)
    const selectEmpName = this.empNameCtrl.value;
    if (this.company == 'PCCTH') {
      if (this.pccEmployee) {
        var empNameObj = this.pccEmployee.find(
          (emp) => emp.firstname + ' ' + emp.lastname == selectEmpName
        );
      }
    } else if (this.company == 'WiseSoft') {
      if (this.wsEmployee) {
        empNameObj = this.wsEmployee.find(
          (emp) => emp.firstname + ' ' + emp.lastname == selectEmpName
        );
      }
    }

    // console.log(this.pccEmployee);
    // console.log(this.wsEmployee);
    this.empCode = empNameObj?.empCode || '';
    this.empPosition = empNameObj?.position.positionName || '';
    this.empId_Table = empNameObj?.id || 0;
    this.sectionOne.get('empName')?.setValue(selectEmpName);
    // console.log('this empobject');
    // console.log(this.sectionOne.value);

    // console.log(empNameObj);
    this.EditSectionOneForm.userId = empNameObj?.id || 0;
    this.EmitEditSectionOne(this.EditSectionOneForm);
  }

  Approvers!: any;
  AllApproves!: any;
  async initApprover() {
    try {
      const res = await this.service.getActiveEmp().toPromise();
      this.AllApproves = res.filter((emp: any) => {
        const hasValidRole =
          emp.roles && emp.roles.length > 0 && emp.roles[0].role === 'Approver';
        const hasValidPosition =
          emp.position && emp.position.positionName === 'VICE PRESIDENT';
        const hasValidMangaer =
          emp.roles && emp.roles.length > 0 && emp.roles[0].role === 'Manager';
        const hasValidPresident =
          emp.roles &&
          emp.roles.length > 0 &&
          emp.roles[0].role === 'President';
        return (
          hasValidRole ||
          hasValidPosition ||
          hasValidMangaer ||
          hasValidPresident
        );
      });
    } catch (err) {
      console.error('Error while getting Approvers: ', err);
    }
  }

  filteredOptions: Observable<string[]> | undefined;

  async onDateClick(typeRadio: string) {
    this.initCourse(typeRadio);

    const option: object = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    if (!this.sectionOne.get('deptCode')?.invalid) {
      this.listEmp.splice(0, this.listEmp.length);
      this.listSaveEmp.splice(0, this.listSaveEmp.length);
      if (typeRadio === 'training') {
        this.trainingRadio.nativeElement.checked = true;
        this.remainingBudget = this.budgetTrain + this.returnBudgetTrain;
        this.sectionOne.get('topic')?.setValue('');

        if (this.sectionOne.get('actionDate')?.value != '') {
          this.trainingDate.nativeElement.value = new Date(
            this.sectionOne.get('actionDate')?.value
          ).toLocaleDateString('th-TH', option);
          this.EditSectionOneForm.actionDate = new Date(
            this.sectionOne.get('actionDate')?.value
          ).toLocaleDateString('en-CA');
        } else {
          this.trainingDate.nativeElement.value = new Date().toLocaleDateString(
            'th-TH',
            { year: 'numeric', month: '2-digit', day: '2-digit' }
          );
        }
      } else if (typeRadio === 'getCertificate') {
        this.getCertificateRadio.nativeElement.checked = true;
        this.remainingBudget = this.budgetCer + this.returnBudgetCer;
        this.sectionOne.get('topic')?.setValue('');

        if (this.sectionOne.get('actionDate')?.value != '') {
          this.getCertificateDate.nativeElement.value = new Date(
            this.sectionOne.get('actionDate')?.value
          ).toLocaleDateString('th-TH', option);
          this.EditSectionOneForm.actionDate = new Date(
            this.sectionOne.get('actionDate')?.value
          ).toLocaleDateString('en-CA');
        } else {
          this.getCertificateDate.nativeElement.value =
            new Date().toLocaleDateString('th-TH', option);
        }
      }
      // console.log(this.remainingBudget);
    }
    this.dateSelected(typeRadio);
    this.genDataTopic();
    this.CreateFormSectionOne.actionDate = new Date().toLocaleDateString(
      'en-CA'
    );
    this.EditSectionOneForm.actionDate;
    this.EmitEditSectionOne(this.EditSectionOneForm);
  }

  dateSelected(action: String) {
    this.sectionOne.get('action')?.setValue(action);
    switch (action) {
      case 'training':
        this.getCertificateDate.nativeElement.value = '';
        // this.getResultDate.nativeElement.value = '';
        // this.testDate.nativeElement.value = '';
        break;
      case 'getCertificate':
        // this.getResultDate.nativeElement.value = '';
        this.trainingDate.nativeElement.value = '';
        // this.testDate.nativeElement.value = '';
        break;
    }
    this.EditSectionOneForm.action = this.sectionOne.get('action')?.value;
    // console.log(this.sectionOne.value);
  }

  empNameCtrl = new FormControl('');
  trainDateCtrl = new FormControl('');
  topicNoteCtrl = new FormControl('');
  projectPriceCtrl = new FormControl('');
  approver1Ctrl = new FormControl('');
  approver2Ctrl = new FormControl('');
  approver3Ctrl = new FormControl('');
  approver4Ctrl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private service: FtrOf1Service,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.sectionOne = this.fb.group({
      companyName: ['PCCTH', Validators.required],
      deptCode: ['', Validators.required],
      dept: ['', Validators.required],
      date: [
        new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      ],
      topic: ['', Validators.required],
      objt: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      fee: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      budget: ['', Validators.required],
      empCode: ['', Validators.required],
      empName: ['', Validators.required],
      empRole: ['', Validators.required],
      action: [''],
      actionDate: [''],
    });
    this.sectionTwo = this.fb.group({
      evaluatorName: [''],
      evaluatorRole: [''],
      evaluatorDept: [''],
      evaluatorSector: [''],
      resultOne: [''],
      resultTwo: [''],
      resultThree: [''],
      resultFour: [''],
      resultFive: [''],
      resultSix: [''],
      resultSeven: [''],
      comment: [''],
      result: ['noResult'],
      cause: [''],
      plan: [''],
    });
  }

  private formatDDMMYYYYtoYYYYMMDD(date: string): string {
    let dfm = date.split('/');
    return `${dfm[2]}-${dfm[1]}-${dfm[0]}`;
  }

  check: any;

  async ngOnInit(): Promise<void> {
    // this.initApprover();
    // console.log('in ftr-of1');
    //preparering approver data in  AllApproves
    const role = this.authService.checkRole();
    this.check = role;
    const UID = this.authService.getUID();
    this.initDeptWithSector(UID);
    // this.initApproveWithSector(UID)

    if (this.trainID == 0) {
      if (role !== 'ROLE_Admin') {
        this.router.navigate(['/pccth/ftr-oj1']);
      }
    }

    if (this.trainID != 0) {
      this.initSectionOne(this.trainID);
      if (role === 'ROLE_User') {
        this.sectionOne.disable();
      } else if (role === 'ROLE_Approver') {
        // this.sectionOne.enable();
      }
    } else {
      // console.log('admin Mode');
    }
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadingpage())).subscribe();
  }

  allTrainning: any = [];
  loadingpage() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.allTrainning = this.listEmp.slice(startIndex, endIndex);
  }
  @Output() nonInbuget = new EventEmitter<boolean>();

  deptRes: any;
  sectorAdminDevPCC = '';
  sectorAdminDevWs = '';
  async initDeptWithSector(id: number) {
    await this.initEmp();
    if (
      this.check == 'ROLE_Personnel' ||
      this.check == 'ROLE_VicePresident' ||
      this.check == 'ROLE_President'
    ) {
      this.service.getAllDeptWithCompany().subscribe((res) => {
        const PCC_DATA = res.filter((item) => item.company == 'PCCTH');
        const WS_DATA = res.filter((item) => item.company == 'WiseSoft');
        this.pccDept = PCC_DATA.map((item) =>
          item.sectors.map((item) => item.departments)
        )
          .flat()
          .flat();
        this.wsDept = WS_DATA.map((item) =>
          item.sectors.map((item) => item.departments)
        )
          .flat()
          .flat();
        this.selectCompany('PCCTH');
      });
    } else {
      this.service.findDepartmentsByUser(id).subscribe((response) => {
        let res = response[0];
        // console.log('con 1');

        let pccdata = res.filter((item: any) => item.company == 'PCCTH');
        let pccDept = pccdata[0]?.sectors;

        let wsdata = res.filter((item: any) => item.company == 'WiseSoft');

        let wsDept = wsdata[0]?.sectors;

        wsDept = wsDept?.map((item: any) => item.departments);
        pccDept = pccDept?.map((item: any) => item.departments);

        this.pccDept = pccDept?.flat() || null;
        this.wsDept = wsDept?.flat() || null;
        this.sectorAdminDevPCC = pccdata[0]?.sectors[0].sectorcode;
        this.sectorAdminDevWs = wsdata[0]?.sectors[0].sectorcode;
        this.deptRes = pccDept;
        this.selectCompany('PCCTH'); // default company
        // this.initDept(res.responseData.result.sector.sectorCode);
      });
    }
  }
  genDataTopic() {
    // console.log('in gentopic');

    const selectedDept = this.sectionOne.get('dept')?.value;
    const selectedTopic = this.sectionOne.get('topic')?.value;

    if (!selectedDept) {
      // ถ้า dept ยังไม่ถูกเลือก
      Swal.fire({
        title: 'เตือน',
        text: 'โปรดเลือกแผนกก่อนเลือกหัวข้อใการอบรม/สัมมนา',
        icon: 'warning',
      });
      this.sectionOne.get('topic')?.setValue(''); // ล้างค่า topic ให้ว่าง
    } else {
      this.service.getCourse(this.sectionOne.get('action')?.value).subscribe(
        (res) => {
          this.course = res;
          const selectedTopicObject = this.course.find(
            (topic: Course) => topic.courseName == selectedTopic
          );

          if (selectedTopicObject) {
            this.course_id = selectedTopicObject.id;
            this.EditSectionOneForm.courseId = this.course_id;
            this.EmitEditSectionOne(this.EditSectionOneForm);
            // ตั้งค่าค่า topic_ojt เป็น 'พัฒนาทักษะแก่ผู้เรียน'
            this.topic_ojt = selectedTopicObject.objective;
            if (
              selectedTopicObject &&
              selectedTopicObject.note !== null &&
              selectedTopicObject.note !== ''
            ) {
              this.topicNoteCtrl.setValue(selectedTopicObject.note);
            } else {
              this.topicNoteCtrl.setValue('-');
            }
            this.topic_location = selectedTopicObject.place;
            this.topic_inst = selectedTopicObject.institute;
            this.topic_date =
              new Date(selectedTopicObject.startDate).toLocaleDateString(
                'en-US'
              ) +
              ' - ' +
              new Date(selectedTopicObject.endDate).toLocaleDateString(
                'en-US'
              ) +
              ' ' +
              selectedTopicObject.time;

            // สร้างค่า 'startDateFormatted' และ 'endDateFormatted' ในรูปแบบ 'YYYY-MM-DD'
            const startDateFormatted = this.formatDateToYYYYMMDD(
              new Date(selectedTopicObject.startDate)
            );
            const endDateFormatted = this.formatDateToYYYYMMDD(
              new Date(selectedTopicObject.endDate)
            );
            this.EditSectionOneForm.budget = selectedTopicObject.price;
            this.sectionOne.get('fee')?.setValue(selectedTopicObject.price);
            this.sectionOne
              .get('company')
              ?.setValue(selectedTopicObject.institute);
            this.sectionOne.get('startDate')?.setValue(startDateFormatted); // ตั้งค่าให้เป็น 'YYYY-MM-DD'
            this.sectionOne.get('endDate')?.setValue(endDateFormatted); // ตั้งค่าให้เป็น 'YYYY-MM-DD'
            this.sectionOne
              .get('location')
              ?.setValue(selectedTopicObject.place);
            this.sectionOne.get('objt')?.setValue(this.topic_ojt);
            this.trainDateCtrl.setValue(this.topic_date);
            this.projectPriceCtrl.setValue(selectedTopicObject.priceProject);

            // ตรวจสอบว่า Remaining Budget มีค่าและมากกว่าหรือเท่ากับรา&&
            if (
              selectedTopicObject.priceProject != null &&
              selectedTopicObject.priceProject != ''
            ) {
              this.etcRadio.nativeElement.checked = true;
              this.budgetRadio.nativeElement.disabled = true;
              this.sectionOne
                .get('budget')
                ?.setValue(selectedTopicObject.priceProject);
              this.nonInbuget.emit(false);
            } else if (
              this.remainingBudget >= selectedTopicObject.price &&
              this.findBudget
            ) {
              // ในกรณีที่ราคาอยู่ในขอบเขตของ Remaining Budget
              const calculatedPrice =
                this.remainingBudget - selectedTopicObject.price;

              const roundedCalculatedPrice =
                Math.round(calculatedPrice * 100) / 100;
              this.etcRadio.nativeElement.checked = false;
              this.sectionOne.get('budget')?.setValue('อยู่ในงบประมาณ');
              this.nonInbuget.emit(false);
              this.onBudgetClick();
            } else if (
              this.remainingBudget < selectedTopicObject.price &&
              this.findBudget
            ) {
              // ในกรณีที่เกินงบประมาณทั้ง Total Budget
              const calculatedPrice =
                selectedTopicObject.price - this.remainingBudget;
              const roundedCalculatedPrice =
                Math.round(calculatedPrice * 100) / 100;
              // ตรวจสอบราคาที่คำนวณ
              this.etcRadio.nativeElement.checked = true;
              this.budgetRadio.nativeElement.disabled = true;
              this.sectionOne
                .get('budget')
                ?.setValue('เกินงบประมาณ ' + roundedCalculatedPrice + ' บาท');
              this.nonInbuget.emit(true);
            } else if (this.findBudget == false) {
              this.etcRadio.nativeElement.checked = true;
              this.budgetRadio.nativeElement.disabled = true;
              this.sectionOne.get('budget')?.setValue('ไม่มีงบประมาณ');
              this.nonInbuget.emit(true);
            }
          } else {
            this.topic_ojt = '';
            this.topic_location = '';
            this.topic_inst = '';
            this.topic_date = '';
            this.projectPriceCtrl.setValue('');
            this.sectionOne.get('budget')?.setValue('');
            this.sectionOne.get('fee')?.setValue('');
          }
        },
        (error) => {
          console.error('Error while get data: ', error);
        }
      );
    }

    this.EmitEditSectionOne(this.EditSectionOneForm);
  }

  sectorCodeDev = '';
  selectCompany(company: string) {
    this.company = company;
    // console.log('Selected company', this.company);
    this.EditSectionOneForm.userId = 0;
    // Initialize sectorId based on company
    if (company == 'PCCTH') {
      this.depts = this.pccDept;
      this.sectorCodeDev = this.sectorAdminDevPCC;
      this.centerEmployee = this.pccEmployee;
      // First dept pcc select
      this.sectionOne.get('dept')?.setValue('');
      this.sectionOne.get('deptCode')?.setValue('');
      // this.sectorId = 1; // Set sectorId to 1 for PCCTH
    } else if (company == 'WiseSoft') {
      this.depts = this.wsDept;
      this.sectorCodeDev = this.sectorAdminDevWs;
      this.centerEmployee = this.wsEmployee;
      // First dept ws select
      this.sectionOne.get('dept')?.setValue('');
      this.sectionOne.get('deptCode')?.setValue('');
      // this.sectorId = 2; // Set sectorId to 2 for WiseSoft
    }

    // Log the updated sectorId for debugging
    // console.log('Updated sectorId', this.sectorId);

    // Fetch the total budget using the selected sectorId
    // this.Approvers = this.AllApproves.filter((item:any) => item.company.companyName == company)

    this.EmitEditSectionOne(this.EditSectionOneForm);
  }

  totalBudget!: number;
  // sectorId: number = 1; // หรือค่าเริ่มต้นที่คุณต้องการ
  remainingBudget!: number;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  Approver1_id: number = 0;
  Approver2_id: number = 0;
  Approver3_id: number = 0;
  Approver4_id: number = 0;
  findApprovesId(name: string, position: number) {
    let approve_object = this.Allemps.find(
      (app: { firstname: string }) => app.firstname == name
    );
    switch (position) {
      case 1:
        this.Approver1_id = approve_object.id;
        this.EditSectionOneForm.approve1_id = approve_object.id;
        break;
      case 2:
        this.Approver2_id = approve_object.id;
        this.EditSectionOneForm.approve2_id = approve_object.id;
        break;
      case 3:
        this.Approver3_id = approve_object.id;
        this.EditSectionOneForm.approve3_id = approve_object.id;
        break;
      case 4:
        this.Approver4_id = approve_object.id;
        this.EditSectionOneForm.approve4_id = approve_object.id;
        break;
      default:
        this.Approver1_id = 0;
        this.Approver2_id = 0;
        this.Approver3_id = 0;
        this.Approver4_id = 0;
        this.EditSectionOneForm.approve1_id = 0;
        this.EditSectionOneForm.approve2_id = 0;
        this.EditSectionOneForm.approve3_id = 0;
        this.EditSectionOneForm.approve4_id = 0;
        break;
    }
    this.EmitEditSectionOne(this.EditSectionOneForm);
  }

  async save() {
    //save
    try {
      // console.log('Saving...');
      // console.log('RAW DATA POST : ', this.listSaveEmp);
      await this.upload();
      if (this.filesID.length == 0) {
        this.filesID = [0];
      }
      for (const iterator of this.listSaveEmp) {
        iterator.actionDate = new Date().toLocaleDateString('en-CA');
        iterator.fileID = this.filesID;
        // console.log('save Data',JSON.stringify(iterator));
        this.service.createSectionOne(iterator);
      }
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'บันทึกการอบรมสำเร็จ!',
        icon: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      // เมื่อเจอ error
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      Swal.fire({
        title: 'บันทึกข้อมูลไม่สำเร็จ!',
        text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล!',
        icon: 'error',
      });
    }
  }

  onBudgetClick() {
    this.etcDetails.nativeElement.value = '';
  }

  etcSelect() {
    const selectedTopic = this.sectionOne.get('topic')?.value;
    const selectedTopicObject = this.course.find(
      (topic: Course) => topic.courseName === selectedTopic
    );
    const Budget = selectedTopicObject.price - this.remainingBudget;
    // console.log(Budget); // แสดงค่า Budget ในคอนโซล
    this.sectionOne.get('budget')?.setValue('เกินงบประมาณ ' + Budget + ' บาท'); // กำหนดค่า Budget ใน sectionOne
  }

  calculateResult() {
    let radioLabel = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
    let pass = 0;
    for (let index = 0; index < radioLabel.length; index++) {
      if (this.sectionTwo.get('result' + radioLabel[index])?.value === 'pass') {
        pass++;
      }
    }

    if (pass >= 4) {
      this.notPass = false;
      return 'pass';
    } else {
      this.notPass = true;
      return 'fail';
    }
  }

  resultSelect(result: string) {
    if (result == 'pass') {
      this.passRadio.nativeElement.checked = true;
      this.passRadio.nativeElement.disabled = false;
      this.sectionTwo.get('result')?.setValue('pass');
      this.failRadio.nativeElement.disabled = true;
      this.noResultRadio.nativeElement.disabled = true;
      this.fCause.nativeElement.disabled = true;
      this.nCause.nativeElement.disabled = true;
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
    if (selected == 'fail') {
      this.nCause.nativeElement.value = '';
      this.nCause.nativeElement.disabled = true;
      this.fCause.nativeElement.disabled = false;
    } else if (selected == 'noResult') {
      this.fCause.nativeElement.value = '';
      this.fCause.nativeElement.disabled = true;
      this.nCause.nativeElement.disabled = false;
    }
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

      this.sectionOne.get('fee')?.setValue(inputValue);
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

  genNewDateSTR(): string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  deptCodeModel!: string;

  budgetTrain = 0;
  budgetCer = 0;
  findBudget = true;
  vicePresidents!: any;
  Managers: any;
  Presidents: any;
  async setDept() {
    this.EditSectionOneForm.userId = 0;
    const selectedDept = this.sectionOne.get('dept')?.value;

    if (this.depts && selectedDept) {
      const selectedDeptObject = this.depts.find(
        (dept: any) => dept.deptname == selectedDept
      );

      if (selectedDeptObject) {
        this.deptCodeModel = selectedDeptObject.deptcode;
        this.sectionOne.get('deptCode')?.setValue(this.deptCodeModel);
        // console.log(selectedDeptObject.deptcode);

        //preparing before selected type of action
        this.trainingRadio.nativeElement.checked = false;
        this.getCertificateRadio.nativeElement.checked = false;
        this.trainingDate.nativeElement.value = '';
        this.getCertificateDate.nativeElement.value = '';

        this.getbudget(selectedDeptObject.deptcode);
      }
    }

    this.sectionOne.get('empCode')?.setValue('');
    this.sectionOne.get('empName')?.setValue('');
    this.empName = '';
    this.sectionOne.get('empRole')?.setValue('');
    this.EmitEditSectionOne(this.EditSectionOneForm);
    //prepare approver of dept
    // console.log(this.AllApproves);
    // console.log(this.centerEmployee);

    let filterEmpDept = this.centerEmployee.filter((item: any) => {
      return item.departments.some(
        (depts: any) => depts.deptName == selectedDept
      );
    });
    this.employees = filterEmpDept.map(
      (obj: { firstname: string; lastname: string }) =>
        obj.firstname + ' ' + obj.lastname
    );
    // this.employees = this.centerEmployee.map()
    if (this.check == 'ROLE_Admin') {
      let Approvers = this.AllApproves.filter((item: any) => {
        return (
          item.companys.some(
            (company: any) => company.companyName == this.company
          ) &&
          item.departments.some((dept: any) => dept.deptName == selectedDept)
        );
      });
      this.Managers = Approvers.filter(
        (item: any) => item.roles[0].role === 'Manager'
      );
      this.Approvers = Approvers.filter(
        (item: any) => item.roles[0].role === 'Approver'
      );
      this.vicePresidents = this.AllApproves.filter((item: any) => {
        return (
          item.companys.some(
            (company: any) => company.companyName == this.company
          ) &&
          item.roles[0].role == 'VicePresident' &&
          item.sector.sectorCode == this.sectorCodeDev
        );
      });
      this.Presidents = this.AllApproves.filter((item: any) => {
        return (
          item.companys.some(
            (company: any) => company.companyName == this.company
          ) && item.roles[0].role == 'President'
        );
      });
    } else {
      this.Managers = this.AllApproves.filter((item: any) => {
        return item.roles[0].role == 'Manager';
      });
      this.Approvers = this.AllApproves.filter((item: any) => {
        return item.roles[0].role == 'Approver';
      });
      this.vicePresidents = this.AllApproves.filter((item: any) => {
        return item.roles[0].role == 'VicePresident';
      });
      this.Presidents = this.AllApproves.filter((item: any) => {
        return item.roles[0].role == 'President';
      });
    }
  }

  private getbudget(deptCode: number) {
    // console.log('deptCode', deptCode);
    this.service
      .getRemainingBudget(new Date().getFullYear(), deptCode)
      .pipe(
        tap((res) => {
          this.budgetCer = res?.budgetCer;
          this.budgetTrain = res?.budgetTrain;
          this.findBudget = true;
          this.sectionOne.get('budget')?.setValue('');
          this.etcRadio.nativeElement.checked = false;
        }),
        catchError((error) => {
          console.error('Error fetching budget:', error);
          this.findBudget = false;
          this.sectionOne.get('budget')?.setValue('ไม่มีงบประมาณ');
          this.etcRadio.nativeElement.checked = true;
          return of(null); // ส่งค่า null กลับเพื่อสร้าง Observable ใหม่
        })
      )
      .subscribe();
  }

  //PCCTH
  //WiseSoft
  pccDept!: any;
  wsDept!: any;
  //The Middle dept array
  depts!: any;
  allDept!: any;

  removePositionAndDuplicates(deptArray: any[]): any[] {
    const uniqueDepts: { [key: string]: any } = {};
    deptArray.forEach((dept) => {
      const key = `${dept.deptname}-${dept.deptcode}`;
      if (!uniqueDepts[key]) {
        uniqueDepts[key] = { ...dept, position: [] };
      }
    });
    return Object.values(uniqueDepts);
  }

  EditSectionOneForm: EditSectionOne = {
    userId: 0,
    dateSave: '',
    day: 0,
    courseId: 0,
    action: '',
    actionDate: '',
    approve1_id: 0,
    approve2_id: 0,
    approve3_id: 0,
    approve4_id: 0,
    budget: 0,
    fileID: [0],
  };

  private dateformatSltoDH(date: string) {
    if (date != null) {
      let dfm = date.split('-');
      return `${dfm[2]}/${dfm[1]}/${Number(dfm[0]) + 543}`;
    }
    return '';
  }

  Editmode = false;
  isCancel = false;
  returnBudgetTrain = 0;
  returnBudgetCer = 0;
  topicType: any;
  isLoading: boolean = true;
  editModeTrainingfile: any = [];
  async initSectionOne(id: number) {
    // console.log('-----------------------------' +id);
    this.isLoading = false;
    await this.initEmp();
    this.service.getSectionOneByID(id).subscribe(async (res) => {
      console.log(res);
      this.DisableCheck(
        this.check,
        res.result_status,
        res.training.result[0].result,
        res.training.status[0].status
      );
      this.Editmode = true;
      if (res.training.courses[0].type == 'อบรม') {
        this.returnBudgetTrain += res.training.courses[0].price;
      } else {
        this.returnBudgetCer += res.training.courses[0].price;
      }
      //prepare approver

      //step One select company and dept for pull remaining budget
      this.sectionOne
        .get('companyName')
        ?.setValue(res.training.user.companys[0]?.companyName);
      this.selectCompany(res.training.user.companys[0]?.companyName || '');

      this.sectionOne
        .get('dept')
        ?.setValue(res.training.user.departments[0].deptName);
      await this.setDept();
      this.sectionOne
        .get('date')
        ?.setValue(this.dateformatSltoDH(res.training.dateSave));

      //step two action select for set remaining ? trainning budget : test budget
      const remainingBudgetResponse = await this.service
        .getRemainingBudget(
          new Date().getFullYear(),
          res.training.user.departments[0].deptCode
        )
        .toPromise();
      this.budgetCer = remainingBudgetResponse?.budgetCer || 0;
      this.budgetTrain = remainingBudgetResponse?.budgetTrain || 0;

      this.sectionOne.get('action')?.setValue(res.training.action);
      this.sectionOne.get('actionDate')?.setValue(res.training.actionDate);
      await this.onDateClick(res.training.action);
      //step three gen course info and cal budget
      this.sectionOne
        .get('topic')
        ?.setValue(res.training.courses[0].courseName);
      this.topicType = res.training.courses[0].type;
      this.genDataTopic();
      //step four gen emp data
      this.empNameCtrl.setValue(
        res.training.user.firstname + ' ' + res.training.user.lastname
      );
      this.genEmpdata();
      let allApproves = res.training.status;
      for (let index = 0; index < allApproves.length; index++) {
        let position = allApproves[index].indexOfSignature;
        let firstname = allApproves[index].approveId.firstname;
        let Approveid = allApproves[index].approveId.id;
        this.signaturePosition(position, firstname, Approveid);
      }

      this.editModeTrainingfile = res.training?.trainingFiles;
      let filesID: number[] = this.editModeTrainingfile?.map(
        (item: any) => item?.id
      ) || [0];
      this.isLoading = true;

      this.EditSectionOneForm.action = res.training.action;
      this.EditSectionOneForm.actionDate = res.training.actionDate;
      this.EditSectionOneForm.courseId = res.training.courses[0].id;
      this.EditSectionOneForm.dateSave = this.formatDDMMYYYYtoYYYYMMDD(
        new Date().toLocaleDateString('en-CA')
      );
      this.EditSectionOneForm.day = res.training.day;
      this.EditSectionOneForm.userId = res.training.user.id;
      this.EditSectionOneForm.budget = res.training.budget;
      this.EditSectionOneForm.fileID = filesID;
    });
  }

  private DisableCheck(
    role: string,
    status: string,
    result: any,
    first_approve: any
  ) {
    // console.log(role);
    // console.log(status);
    // console.log(result);

    if (role == 'ROLE_Admin') {
      if (status == 'ยกเลิก' || status == 'ไม่อนุมัติ' || result != null) {
        // console.log('เข้าเงื่อนไข : 1');
        this.sectionOne.disable();
        this.empNameCtrl.disable();
        this.isCancel = true;
      } else if (
        result == null &&
        (status == 'อนุมัติ' || first_approve == 'อนุมัติ')
      ) {
        this.sectionOne.disable();
        this.empNameCtrl.enable();
        this.isCancel = true;
        // console.log('เข้าเงื่อนไข : 2');
      } else if (result == null && status == 'รอประเมิน') {
        this.sectionOne.enable();
        this.empNameCtrl.enable();
        this.isCancel = false;
      }
    } else {
      this.sectionOne.disable();
      this.empNameCtrl.disable();
      this.isCancel = true;
      // console.log('เข้าเงื่อนไข : 3');
    }
  }
  @Output() sectionOneOutput = new EventEmitter<EditSectionOne>();
  EmitEditSectionOne(section: EditSectionOne) {
    this.sectionOneOutput.emit(section);
  }

  listEmp: listEmp[] = [];
  listSaveEmp: CreateSectionOne[] = [];

  private duplicateCheck(data: listEmp): boolean {
    const isDuplicate = this.listEmp.some((dataset) => {
      return (
        dataset.empCode === data.empCode &&
        dataset.courseName === data.courseName &&
        dataset.action === data.action &&
        dataset.company === data.company &&
        dataset.approver === data.approver
      );
    });

    return isDuplicate;
  }

  pushData() {
    const startDate = new Date(this.sectionOne.get('startDate')?.value); // วันที่ 1
    const endDate = new Date(this.sectionOne.get('endDate')?.value); // วันที่ 2
    const numberOfDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const courseId = this.course_id;
    const userID = this.empId_Table;
    //
    // const userID = this.pccEmployee[0].id;
    let approve1_id = this.Approver1_id;
    let approve2_id = this.Approver2_id;
    let approve3_id = this.Approver3_id;
    let approve4_id = this.Approver4_id;

    //set val
    let Dataset = Object.assign(this.sectionOne.value);
    this.CreateFormSectionOne.courseId = courseId;
    this.CreateFormSectionOne.userId = userID;
    this.CreateFormSectionOne.approve1_id = approve1_id;
    this.CreateFormSectionOne.approve2_id = approve2_id;
    this.CreateFormSectionOne.approve3_id = approve3_id;
    this.CreateFormSectionOne.approve4_id = approve4_id;
    this.CreateFormSectionOne.action = Dataset.action;
    this.CreateFormSectionOne.actionDate = Dataset.actionDate;
    this.CreateFormSectionOne.dateSave = this.formatDDMMYYYYtoYYYYMMDD(
      this.sectionOne.get('date')?.value
    );
    this.CreateFormSectionOne.day = numberOfDays;

    ///for show in table
    let tableData: listEmp = {
      action: this.sectionOne.get('action')?.value,
      company: this.company,
      cost: this.sectionOne.get('fee')?.value,
      courseName: this.sectionOne.get('topic')?.value,
      empCode: this.sectionOne.get('empCode')?.value,
      empDept: this.sectionOne.get('dept')?.value,
      empName: this.empName,
      empPosition: this.sectionOne.get('empRole')?.value,
      approver: this.approver1Ctrl?.value,
    };

    let DataSave: CreateSectionOne = {
      action: this.CreateFormSectionOne.action,
      actionDate: this.CreateFormSectionOne.actionDate,
      approve1_id: this.CreateFormSectionOne.approve1_id,
      approve2_id: this.CreateFormSectionOne.approve2_id,
      approve3_id: this.CreateFormSectionOne.approve3_id,
      approve4_id: this.CreateFormSectionOne.approve4_id,
      budget: this.sectionOne.get('fee')?.value,
      courseId: this.CreateFormSectionOne.courseId,
      dateSave: this.CreateFormSectionOne.dateSave,
      day: this.CreateFormSectionOne.day,
      userId: this.CreateFormSectionOne.userId,
      fileID: [0],
    };
    if (!this.sectionOne.invalid) {
      if (!this.duplicateCheck(tableData)) {
        // ไม่มีข้อมูลซ้ำ จึงเพิ่มข้อมูล
        this.listEmp.push(tableData);
        this.listSaveEmp.push(DataSave);
        this.remainingBudget -= tableData.cost || 0;
        this.loadingpage()
        this.pageLength++;
      } else {
        // มีข้อมูลซ้ำ แจ้งเตือน
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ!',
          text: 'มีข้อมูลที่ซ้ำในรายการที่บันทึกไว้!',
          icon: 'warning',
        });
      }
    } else {
      Swal.fire({
        title: 'บันทึกไม่สำเร็จ!',
        text: 'โปรดกรอกข้อมูล หรือ ตรวจสอบงบประมาณ!',
        icon: 'warning',
      });
    }

    this.empName = '';
    this.empCode = '';
    this.empPosition = '';
    this.genDataTopic();
  }

  removeData(data: any) {
    this.remainingBudget =
      this.remainingBudget + (this.listEmp[data].cost || 0);
    this.listEmp.splice(data, 1);
    this.listSaveEmp.splice(data, 1);
    this.allTrainning.splice(data, 1)
    this.pageLength--;
    this.genDataTopic();
  }
  ////////////// File Manage zone
  files: File[] = [];
  selectedFile: File[] = [];
  @Output() Outputfiles = new EventEmitter<File[]>();
  fileOnChange(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.files.push(selectedFiles[i]);
      }
      this.Outputfiles.emit(this.files);
    }
  }

  filesID: any[] = [];
  async upload() {
    this.selectedFile = this.files;
    if (this.selectedFile.length > 0) {
      for (const file of this.files) {
        try {
          const response: any = await this.service.uploadFile(file).toPromise();
          console.log('File uploaded successfully!', response);
          this.filesID.push(response.ID);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      this.selectedFile = [];
    } else {
      console.error('No files selected.');
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  removeFileEditMode(i: number) {
    this.editModeTrainingfile.splice(i, 1);
    this.EditSectionOneForm.fileID = this.editModeTrainingfile.map(
      (item: any) => item.id
    );
    this.sectionOneOutput.emit(this.EditSectionOneForm);
  }

  signaturePosition(number: number, value: any, id: number) {
    switch (number) {
      case 1:
        this.approver1Ctrl.setValue(value);
        this.EditSectionOneForm.approve1_id = id;
        break;
      case 2:
        this.approver2Ctrl.setValue(value);
        this.EditSectionOneForm.approve2_id = id;
        break;
      case 3:
        this.approver3Ctrl.setValue(value);
        this.EditSectionOneForm.approve3_id = id;
        break;
      case 4:
        this.approver4Ctrl.setValue(value);
        this.EditSectionOneForm.approve4_id = id;
        break;
      default:
        this.approver1Ctrl.setValue('');
        this.approver2Ctrl.setValue('');
        this.approver3Ctrl.setValue('');
        this.approver4Ctrl.setValue('');
        break;
    }
  }

  DownloadFile(index: number) {
    let fileID = this.editModeTrainingfile[index].id;
    let fileName = this.editModeTrainingfile[index].fileName;
    this.service.getFile(fileID).subscribe(
      (res) => {
        let base64 = res.file;
        let fileType = res.type; // ประเภทของไฟล์

        // Create an anchor element
        const downloadLink = document.createElement('a');

        // Convert base64 to Blob
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: fileType });

        // Set attributes for the download link
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;

        // Append anchor element to the body
        document.body.appendChild(downloadLink);

        // Click on the link to trigger the download
        downloadLink.click();

        // Cleanup: Remove the link from the DOM
        document.body.removeChild(downloadLink);
      },
      (error) => {
        console.error('Error downloading file:', error);
        // Handle errors as needed
      }
    );
  }

  refreshBtn() {
    // Use location.reload() to refresh the window
    // this.searchForm.reset();
    this.Approver1_id = 0;
    this.Approver2_id = 0;
    this.Approver3_id = 0;
    this.Approver4_id = 0;
    this.approver1Ctrl.setValue('');
    this.approver2Ctrl.setValue('');
    this.approver3Ctrl.setValue('');
    this.approver4Ctrl.setValue('');
  }

  isFormValid(): boolean {
    // ตรวจสอบข้อมูลใน sectionOne, budget และ projectPriceCtrl
    const sectionOneValid = this.sectionOne.valid;
    const budgetValid =
      this.sectionOne.get('budget')?.value != 'อยู่ในงบประมาณ';
    const projectPriceValid = !!this.projectPriceCtrl.value;

    // ตรวจสอบความถูกต้องของ approver ใด ๆ
    const anyApproverValid =
      !!this.approver1Ctrl.value ||
      !!this.approver2Ctrl.value ||
      !!this.approver3Ctrl.value ||
      !!this.approver4Ctrl.value;
    // เงื่อนไขสำหรับปุ่ม
    // console.log('sectionOneValid', sectionOneValid);
    // console.log('budgetValid', budgetValid);
    // console.log('projectPriceValid', projectPriceValid);
    // console.log('anyApproverValid', anyApproverValid);
    const isButtonDisabled =
      (!sectionOneValid || !(budgetValid && !projectPriceValid)) &&
      anyApproverValid;
    // console.log('รวม', isButtonDisabled);
    return isButtonDisabled;
  }
}

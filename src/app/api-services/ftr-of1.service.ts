import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Course,
  CreateSectionOne,
  DeptsWithSector,
  ViceAndApprover,
  allDeptCompany,
  budgetResponse,
  findUserById
} from 'src/environments/interfaces/environment-options.interface';

@Injectable({
  providedIn: 'root',
})
export class FtrOf1Service {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // saveData(data : any){
  //   return this.http.post(this.apiServerUrl+'/saveData',JSON.stringify(data),{ headers: this.headers, responseType: 'text' })
  //   .subscribe(
  //     (response) => {
  //       console.log('Data saved successfully:', response);
  //     },
  //     (error) => {
  //       console.error('Error while saving data:', error);
  //     })
  // }

  getCourse(type: string): Observable<Course> {
    // ใช้ Observable ในการรับข้อมูล
    if (type == 'training') {
      return this.http.get<Course>(`${this.api}/findAllCourse`);
    } else {
      return this.http.get<Course>(`${this.api}/findAllTest`);
    }
  }

  getDept(): Observable<any> {
    return this.http.get<any>(this.api + '/findAllDepartments');
  }

  getAllDeptWithCompany(): Observable<allDeptCompany[]> {
    return this.http.get<allDeptCompany[]>(
      this.api + '/findAllJoinDepartments'
    );
  }

  getDeptsWithSector() : Observable<DeptsWithSector[]>{
    return this.http.get<DeptsWithSector[]>(
      this.api + '/findAllJoinDepartmentssector'
    )
  }

  getApprover(): Observable<any> {
    return this.http.get<any>(this.api + '/findAllApprover');
  }

  getViceandApprover(): Observable<ViceAndApprover[]> {
    return this.http.get<ViceAndApprover[]>(
      this.api + '/findAllVicePresidentAndApprover'
    );
  }

  getEmp(): Observable<any> {
    return this.http.get<any>(this.api + '/findAllEmployee');
  }

  getActiveEmp(): Observable<any> {
    return this.http.get<any>(this.api + '/findActiveEmployees');
  }

  createSectionOne(data: CreateSectionOne) {
    // console.log('create');

    // console.log(data);

    return this.http
      .post<CreateSectionOne>(
        this.api + '/createTraining',
        JSON.stringify(data),
        { headers: this.headers }
      )
      .subscribe(
        (res) => {
          // console.log('SectionOne create success', res);
          
        },
        (err) => {
          console.error('Error while create sectionOne', err);
        }
      );
  }

 //แก้อยู่

  getRemainingBudget(year: number, deptCode: number): Observable<budgetResponse> {
    return this.http.get<budgetResponse>(
      `${this.api}/findTotalRemain?year=${year}&departmentCode=${deptCode}`
    );
  }

  getSectionOneByID(id: number): Observable<any> {
    return this.http.get<any>(
      this.api + '/findTrainingByTrainingId?trainingId=' + id
    );
  }

  getTotalBudget(year: number, deptId: number): Observable<budgetResponse> {
    return this.http.get<budgetResponse>(
      `${this.api}/findTotalBudget?year=${year}&departmentId=${deptId}`
    );
  }

  getUserInfo(id : number) : Observable<findUserById>{
    return this.http.get<findUserById>(
      `${this.api}/findUserById?userId=${id}`
    )
  }

  findDepartmentsByUser(id: number){
    return this.http.get<any>(
      `${this.api}/findDepartmentsByUser?userId=${id}`
    )
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Accept': 'application/json' // แก้ไขตามความต้องการของ API
    });

    return this.http.post(`${this.api}/uploadFile`, formData, { headers: headers });
  }

  getFile(fileID: number): Observable<any> {
    const url = `${this.api}/getFile?fileID=${fileID}`;
    return this.http.get<any>(url);
  }
}

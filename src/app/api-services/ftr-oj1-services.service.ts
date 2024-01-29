import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import {
  Course,
  EditSectionTwo,
  GetTrainingById,
  Training,
  allDeptCompany,
  findUserById,
} from 'src/environments/interfaces/environment-options.interface';

@Injectable({
  providedIn: 'root',
})
export class FtrOj1ServicesService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  apiurl = 'http://localhost:8080';

  getFindAll(): Observable<any> {
    // ใช้ Observable ในการรับข้อมูล
    return this.http.get<any>(this.apiurl + '/findAll');
  }

  sortData(data: any[], property: string, order: 'asc' | 'desc'): any[] {
    return data.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  deleteId(id: number) {
    return this.http.delete(this.apiurl + '/deleteById?id=' + id);
  }

  getDatabyId(id: number): Observable<any> {
    return this.http
      .get(this.apiurl + 'findTrainingById?trainingId=' + id)
      .pipe(
        tap((data) => {}),
        catchError((error) => {
          console.error('Error:', error); // บันทึกค่าข้อผิดพลาด
          return throwError(error); // ส่งค่าข้อผิดพลาดต่อไปเพื่อการจัดการเพิ่มเติม
        })
      );
  }

  editData(data: any) {
    return this.http
      .post(this.apiurl + '/edit', JSON.stringify(data), {
        headers: this.headers,
        responseType: 'text',
      })
      .subscribe(
        (response) => {
          if (response === 'SUCCESS') {
          } else {
            console.error('Unexpected response:', response);
          }
        },
        (error) => {
          console.error('Error while saving data:', error);
        }
      );
  }

  // search(empName: string, empRole: string, department: string, topic: string): Observable<any> {
  //   // สร้าง URL สำหรับการเรียก API ในรูปแบบที่คุณต้องการ
  //   const url = `${this.apiurl}/search?empName=${empName}&empRole=${empRole}&department=${department}&topic=${topic}`;

  //   // ใช้ HttpClient เพื่อเรียก API
  //   return this.http.get(url);
  // }

  search(searchParams: any): Observable<any> {
    // สร้าง URL สำหรับการเรียก API ในรูปแบบที่คุณต้องการ
    const url = `${this.apiurl}/searchTraining`;

    // ใช้ HttpClient เพื่อเรียก API
    return this.http.get<any>(url, { params: searchParams });
  }

  getCourses(): Observable<Course> {
    // ใช้ Observable ในการรับข้อมูล
    return this.http.get<Course>(this.apiurl + '/findAllCourses');
  }

  getCourse(): Observable<Course> {
    // ใช้ Observable ในการรับข้อมูล
    return this.http.get<Course>(this.apiurl + '/findAllCourse');
  }

  getTest(): Observable<Course> {
    // ใช้ Observable ในการรับข้อมูล
    return this.http.get<Course>(this.apiurl + '/findAllTest');
  }

  saveData(data: any) {
    return this.http
      .post(this.apiurl + '/saveData', JSON.stringify(data), {
        headers: this.headers,
        responseType: 'text',
      })
      .subscribe(
        (response) => {},
        (error) => {
          console.error('Error while saving data:', error);
        }
      );
  }

  findAllTraining(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiurl + '/findAllTraining');
  }

  findTrainingByUserId(id: number): Observable<GetTrainingById[]> {
    return this.http.get<GetTrainingById[]>(
      this.apiurl + '/findTrainingByUserId?userId=' + id
    );
  }

  getAllDeptWithCompany(): Observable<allDeptCompany[]> {
    return this.http.get<allDeptCompany[]>(
      this.apiurl + '/findAllJoinDepartments'
    );
  }

  getAlldeptWithAdmin(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiurl}/findDepartmentsByUser?userId=${id}`
    );
  }

  getAlldeptWithCompanyV2(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/findAllJoinDepartmentssector`);
  }

  findTrainingByTrainID(id: number): Observable<GetTrainingById> {
    return this.http.get<GetTrainingById>(
      this.apiurl + '/findTrainingByTrainingId?trainingId=' + id
    );
  }
  findTrainingByApproveId(id: number): Observable<Training[]> {
    return this.http.get<Training[]>(
      this.apiurl + '/findTrainingByApprove1Id?approve1Id=' + id
    );
  }

  getTrainApproveByCount(count: number): Observable<Training[]> {
    return this.http.get<Training[]>(
      `${this.apiurl}/findAllApprove?count=${count}`
    );
  }
  findTrainingByPersonnelId(id: number): Observable<Training[]> {
    return this.http.get<Training[]>(
      this.apiurl + '/findTrainingByPersonnelId?PersonnelId=' + id
    );
  }

  cancelTraining(id: number) {
    return this.http.put(
      `${this.apiurl}/setCancelToTraining?trainingId=${id}`,
      null,
      { headers: { Accept: '*/*' } }
    );
  }

  approveTraining(
    TrainId: number,
    ApproveId: number,
    approved: string
  ): Observable<any> {
    const url = `${this.apiurl}/setStatusToTraining?trainingId=${TrainId}&approveId=${ApproveId}&statusApprove=${approved}`;

    return this.http.put(url, {});
  }

  EditSectionOne(trainingId: number, trainingData: any) {
    const url = `${this.apiurl}/editTrainingSection1?trainingId=${trainingId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*',
    });
    // window.location.reload();

    return this.http.post(url, JSON.stringify(trainingData), { headers });
  }

  EditSectionTwo(
    resultId: number,
    resultValue: EditSectionTwo
  ): Observable<EditSectionTwo> {
    return this.http.post<EditSectionTwo>(
      `${this.apiurl}/editTrainingSection2?resultId=${resultId}`,
      JSON.stringify(resultValue),
      {
        headers: this.headers,
      }
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/findUserById?userId=${id}`);
  }

  editTrainingSection1Person(
    trainingId: number,
    action: string,
    actionDate: string
  ) {
    const url = `${this.apiurl}/editTrainingSection1Person?trainingId=${trainingId}`;
    const body = { action, actionDate };

    return this.http.post(url, body);
  }

  getReport(param: any): Observable<any> {
    const url = `${this.apiurl}/Report`;
    return this.http.get<any>(url, { params: param });
  }

  getUserInfo(id: number): Observable<findUserById> {
    return this.http.get<findUserById>(
      `${this.apiurl}/findUserById?userId=${id}`
    );
  }

  generic9EVO(report: any): Observable<any> {
    // สร้าง URL สำหรับการเรียก API ในรูปแบบที่คุณต้องการ
    const url = `${this.apiurl}/ReportGeneric9`;

    // ใช้ HttpClient เพื่อเรียก API
    return this.http.get<any>(url, { params: report });
  }

  ReportHistoryTraining(params: any): Observable<any> {
    const url = `${this.apiurl}/ReportHistoryTraining`;
    return this.http.get<any>(url, { params: params });
  }

  getAllSector(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/findAllSector`);
  }

  editGeneric9(id: number, resultValue: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiurl}/editGeneric9?Generic9id=${id}`,
      JSON.stringify(resultValue),
      {
        headers: this.headers,
      }
    );
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      Accept: 'application/json', // แก้ไขตามความต้องการของ API
    });

    return this.http.post(`${this.apiurl}/uploadFile`, formData, {
      headers: headers,
    });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { allDeptCompany } from 'src/environments/interfaces/environment-options.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  apiurl = 'http://localhost:8080';

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

  getAllCompany(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllCompany');
  }

  getAllSector(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllSector');
  }

  getAllPositions(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllPositions');
  }

  getAllDepartments(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllDepartments');
  }

  postEmployee(data: any): Observable<any> {
    // console.log(data);

    return this.http.post(
      this.apiurl + '/createEmployee',
      JSON.stringify(data),
      { headers: this.headers, responseType: 'text' }
    );
  }

  createEmpExcel(data: any): Observable<any> {
    return this.http.post(
      `${this.apiurl}/createEmployeeExcel`,
      JSON.stringify(data),
      { headers: this.headers, responseType: 'text' }
    );
  }

  getAllEmployee(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAll');
  }

  getActiveEmp(adminId: number): Observable<any> {
    console.log(adminId)
    return this.http.get<any>(
      `${this.apiurl}/findActiveEmployeesByAdminId?adminId=${adminId}`
    )
  }

  getAllDeptWithCompany(): Observable<allDeptCompany[]> {
    return this.http.get<allDeptCompany[]>(
      this.apiurl + '/findAllJoinDepartments'
    );
  }

  deleteById(id: number) {
    return this.http.delete(this.apiurl + '/deleteById?id=' + id);
  }

  putEditEmployee(id: number, data: any) {
    return this.http.put(this.apiurl + '/editEmployee?userId=' + id, data);
  }

  getEmployeeById(id: number) {
    return this.http.get<any>(this.apiurl + '/findUserById?userId=' + id);
  }

  putStatusToUser(id: number, status: string) {
    return this.http.put(
      this.apiurl + `/setStatusToUser?userId=${id}&statusUser=${status}`,
      status
    );
  }

  getSearchUser(searchParams: any): Observable<any> {
    const url = `${this.apiurl}/searchUser`;
    return this.http.get<any>(url, { params: searchParams });
  }

  findDeptByAdmin(id: number): Observable<allDeptCompany[]> {
    return this.http.get<allDeptCompany[]>(
      `${this.apiurl}/findDepartmentsByUser?userId=${id}`
    );
  }

  findAllPosition(): Observable<any> {
    return this.http.get(`${this.apiurl}/findAllPositions`);
  }

  createPosition(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: '*/*',
    });

    return this.http.post<any>(`${this.apiurl}/createPosition`, data, {
      headers: headers,
    });
  }
}

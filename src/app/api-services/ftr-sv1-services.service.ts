import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeptsWithSector, allDeptCompany } from 'src/environments/interfaces/environment-options.interface';

@Injectable({
  providedIn: 'root',
})
export class FtrSv1ServicesService {
  constructor(private http: HttpClient) {}

  apiurl = 'http://localhost:8080';

  addSv1(inputdata: any) {
    return this.http.post<any>(this.apiurl + '/createbudget', inputdata);
  }

  Getuser() {
    return this.http.get<any>(this.apiurl + '/findAllBudget');
  }

  Report() {
    return this.http.get(this.apiurl + '/report', { responseType: 'text' });
  }

  getAllDeptWithCompany(): Observable<allDeptCompany[]> {
    return this.http.get<allDeptCompany[]>(
      'http://localhost:8080/findAllJoinDepartments'
    );
  }


  findBudgetParams(searchParams: any): Observable<any> {
    const url = `${this.apiurl}/findBudget`;
    return this.http.get<any>(url, { params: searchParams }); 
  }

  getTotalBudget(year: string, departmentId: string): Observable<number> {
    const params = new HttpParams()
      .set('year', year)
      .set('departmentCode', departmentId);

    return this.http.get<number>(`${this.apiurl}/findTotalBudget`, { params });
  }

  getTotalRemain(year: string, departmentId: string): Observable<number> {
    const params = new HttpParams()
      .set('year', year)
      .set('departmentCode', departmentId);

    return this.http.get<number>(`${this.apiurl}/findTotalRemain`, { params });
  }

  getDeptsWithSector() : Observable<DeptsWithSector[]>{
    return this.http.get<DeptsWithSector[]>(
      this.apiurl + '/findAllJoinDepartmentssector'
    )
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient,) { }

  apiurl = "http://localhost:8080"

  getFindAll(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllCourses');
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

  addCourse(data:any) {
    return this.http.post<any>(this.apiurl + '/createCourse', data)
  }

  deleteId(course_id: number) {
    return this.http.delete(this.apiurl + '/deleteCourseById?courseID=' + course_id)
  }

  getCoursebyId(id: number){
    return this.http.get(this.apiurl + '/findCourseById?CourseId=' + id)
  }

  editCourse(id: number,data:any) {
    return this.http.put<any>(this.apiurl + '/editCourse?courseID=' + id, data)
  }

  getFindAllCourse(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllCourse');
  }

  getFindAllTest(): Observable<any> {
    return this.http.get<any>(this.apiurl + '/findAllTest');
  }

}

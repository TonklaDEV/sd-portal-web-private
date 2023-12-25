import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignatureResponse, } from 'src/environments/interfaces/environment-options.interface';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private apiurl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  // uploadSignature(userId: number, imageFile: File): Observable<SignatureResponse> {
  //   const url = `${this.apiurl}/signature/uploadSignature?userId=${userId}`;
  //   const formData = new FormData();
  //   formData.append('file', imageFile);
  //   return this.http.post<SignatureResponse>(url, formData);
  // }

  uploadSignature(userId: number, imageFile: File): Observable<string> {
    const url = `${this.apiurl}/uploadSignatureImage?userId=${userId}`;
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http.post(url, formData, { responseType: 'text' });
  }

  getSignatureImage(userId: number): Observable<Blob> {
    const url = `${this.apiurl}/getSignatureImage?userId=${userId}`;
    return this.http.get(url, { responseType: 'blob' });
  }


  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก http://localhost:8080/findAllApprover
  findAllVicePresidentAndApprover(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/findAllVicePresidentAndApprover`);
  }

  findActiveEmp(): Observable<any>{
    return this.http.get<any>(`${this.apiurl}/findActiveEmployees`)
  }

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก http://localhost:8080/findAllPersonnel
  findAllPersonnel(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/findAllPersonnel`);
  }

  getUserById(id:number): Observable<any>{
    return this.http.get<any>(`${this.apiurl}/findUserById?userId=${id}`)
  }

}

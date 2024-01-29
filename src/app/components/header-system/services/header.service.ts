import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private api = 'http://localhost:8080';

  // แก้ไขการ inject จาก HeaderService เป็น HttpClient
  constructor(private http: HttpClient) { }

  // ฟังก์ชันเปลี่ยนรหัสผ่าน
  changePassword(userId: number, oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const url = `${this.api}/changePassword?userId=${userId}`;

    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };

    return this.http.put(url, payload);
  }
}

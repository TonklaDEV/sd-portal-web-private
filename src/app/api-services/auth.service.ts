import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {}

  baseUrl = 'http://localhost:8080'; // URL ของ API Service

  checkRole(){
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Decode the JWT token
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const userRoles = decodedToken.role.map(
        (role: { authority: any }) => role.authority
      );
      return userRoles[0];
    }
  }

  getUID(){
    const accessToken = localStorage.getItem('access_token')
    if(accessToken){
      const decodedToken = this.jwtService.decodeToken(accessToken)
      const id = decodedToken.sub
      return id
    }
  }

  login(email: string, password: string): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = {
      'email': email,
      'password': password
    }
  
    return this.http.post(`${this.baseUrl}/auth/login`, body 
    //{ headers }
    );
  }
  
  


}

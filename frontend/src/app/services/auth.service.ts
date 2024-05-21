import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/User.model';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  baseUrl = 'http://localhost:3000';

  register(email: string, password: string): Observable <User>{
    return this.http.post<User>(`${this.baseUrl}/auth/register`, { email, password});
  }

  login(email: string, password: string): Observable <any>{
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password}).pipe(
      tap((user) => {
        if(user && user.token){
          this.cookieService.set('authToken', user.token, { path: '/' });
          this.cookieService.set('user', user.email, { path: '/' });
        }
      })
    )
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  forgotPassword(email: string): Observable <any>{
    return this.http.post<any>(`${this.baseUrl}/password-reset/request`, { email });
  }

  // auth.service.ts
resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/password-reset/reset`, { token, newPassword });
}

  
}

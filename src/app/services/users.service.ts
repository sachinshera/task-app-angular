import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API = `${environment.config.apiUrl}/users`;
  constructor(
    private http: HttpClient // private authService: AuthService
  ) {}

  signup(user: any): Observable<any> {
    return this.http.post<any>(`${this.API}`, user);
  }
}

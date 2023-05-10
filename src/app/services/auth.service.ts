import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.config.apiUrl;
  constructor(private http: HttpClient, private Router: Router) {}

  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/login`, { email, password }).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // set token on local storage

  setToken(token: string): void {
    new Promise((resolve, reject) => {
      let set: any = localStorage.setItem('token', token);
      if (set) {
        resolve(set);
      } else {
        reject(set);
      }
    });
  }

  // check user has token or not and validate token

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem('token');
      console.log('token is ', token);

      if (token == null) {
        this.Router.navigate(['/']);
        reject(false);
      }
      this.verifyToken(token as string)
        .then((response) => resolve(true))
        .catch((error) => {
          reject(false);
        });
    });
  }

  // veryfy token

  verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiUrl}/verify`, {
          headers: {
            Authorization: token,
          },
        })
        .subscribe(
          (response: any) => {
            resolve(true);
          },
          (error) => {
            reject(error);
            this.logout();
          }
        );
    });
  }

  // rempve token from local storage

  logout() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('token');
      resolve(true);
      // request to server to remove token from database
      this.http
        .get(`${this.apiUrl}/logout`, {
          headers: {
            Authorization: localStorage.getItem('token') as string,
          },
        })
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}

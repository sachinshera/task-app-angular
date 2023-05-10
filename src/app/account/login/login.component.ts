import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  errorMessage: string = '';
  public isLoading: boolean = false;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    // check user is authenticated or not

    this.authService.isAuthenticated().then((response) => {
      if (response) {
        this.router.navigate(['/task']);
      }
    });
  }

  // submit form

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then((response) => {
          this.isLoading = false;
          this.authService.setToken(response.token);
          this.router.navigate(['/task']);
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
          console.log('msg', error.error.message);
          this.errorMessage = error.error.message;
          this.clearErrorMessage();
        });
    } else {
      console.log('form is invalid');
    }
  }

  // clear eroor message after 5 seconds

  clearErrorMessage() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}

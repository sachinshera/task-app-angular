import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public signupForm!: any;
  public errorMessage = '';
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile_number: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(14),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  submitForm() {
    if (this.signupForm.valid) {
      this.usersService.signup(this.signupForm.value).subscribe(
        (res) => {
          console.log(res);
          this.clearErrorMessageAfter5Seconds();
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 2000);
          this.errorMessage = 'User created successfully';
        },
        (err) => {
          this.clearErrorMessageAfter5Seconds();
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );
    }
  }

  clearErrorMessageAfter5Seconds() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}

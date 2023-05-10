import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  constructor(public authService: AuthService) {
    this.authService.isAuthenticated().then((response) => {
      if (!response) {
        this.authService.logout();
      }
    });
  }
}

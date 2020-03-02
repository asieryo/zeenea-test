import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TechnicalExercise';

  constructor(
    public router: Router,
    public userService: UserService
  ) {

  }

  ngOnInit() {
    this.userService.httpGetUsers();

    this.router.navigate(['/home']);
  }
}

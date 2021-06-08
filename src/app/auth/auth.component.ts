import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthResponseData, AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null

  user = new Subject<User>();


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm) {
    // console.log(form.value)
    if (!form.valid) {
      return;
    }
    this.isLoading = true
    const email = form.value.email
    const password = form.value.password

    let authObs: Observable<AuthResponseData>

    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, password)
    } else {
      authObs = this.authService.signUp(email, password)
    }

    // common subscribe for both login & signup's
    authObs.subscribe(resData => {
      console.log(resData)
      this.isLoading = false
      this.error = null
      // on succesful loggin, navigate to recipes section
      this.router.navigate(['/recipes'])
    }, errorMessage => {
      console.log(errorMessage)
      this.error = errorMessage
      this.isLoading = false
    })
    form.reset()
  }

}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCkEoXVOeEdjVlz5s7ju-JwDhgrUcI6mdY',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }
        )
      )


    // Catch & Throw error handling seperate type
    // .pipe(catchError(errorRes => {
    //   let errorMessage = 'An unknown error occurred.!'
    //   if (!errorRes.error || !errorRes.error.error) {
    //     return throwError(errorMessage)
    //   }
    //   switch (errorRes.error.error.message) {
    //     case 'EMAIL_EXISTS':
    //       errorMessage = 'This email already exixts.!'
    //     default:
    //       break;
    //   }
    //   return throwError(errorMessage)
    // }))

    // handle authentication seperate type
    // tap(resData => {
    //   // forming date stamp for user constructor
    //   const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)
    //   // forming user constructor
    //   const user = new User(resData.email, resData.localId, resData.idToken, expirationDate)
    //   // emiting the user to whole app for user details
    //   this.user.next(user)
    // }))
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCkEoXVOeEdjVlz5s7ju-JwDhgrUcI6mdY',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }
        ))
  }

  private handleAuthentication(email: string, userId: string, token: string,
    expiresIn: number) {
    // forming date stamp for user constructor
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    // forming user constructor
    const user = new User(email, userId, token, expirationDate)
    // emiting the user to whole app for user details
    this.user.next(user)
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.!'
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exixts.!'
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email doesnot exixt.!'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password entered is wrong.!'
        break;
    }
    return throwError(errorMessage)
  }
}
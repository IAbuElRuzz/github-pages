import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})

/**
 * Github Http service
 * Utility Methods to handle http
 * requests via Github Api
 */
export class GithubService {
  private limitResults = 10;
  private httpOptions = {};
  private githubApikey = environment.GITHUB_API_KEY;
  private githubApiUrl = environment.GITHUB_API_URL;

  constructor(private http: HttpClient) {
    this.httpOptions = this.setHttpOptions(this.githubApikey);
  }

  /**
   * Get all Users using Github API.
   * @param lastUserId The last UserId as a parameter to be used with `since`
   * The since parameter is a UserId (Only return users with an ID greater than this ID.)
   * https://docs.github.com/en/rest/reference/users#list-users
   * @return An `Observable` containing an Array of User
   */
  getAllUsers(lastUserId: number = 0): Observable<User[]> {
    return this.http
      .get<User[]>(
        `${this.githubApiUrl}/users?since=${lastUserId}&per_page=${this.limitResults}`,
        this.httpOptions
      )
      .pipe(
        map((response: User[]) => response),
        catchError(this.handleError)
      );
  }
  /**
   * Get user details
   * @param userName  The name of the User
   * @return An `Observable` of User
   *
   */
  getUserDetails(userName: string): Observable<User> {
    return this.http
      .get<User>(`${this.githubApiUrl}/users/${userName}`, this.httpOptions)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError)
      );
  }
  /**
   * Get user by Url
   * @param url  The url of the User
   * @return An `Observable` of User
   *
   */
  getUserByURL(url: string): Observable<User> {
    return this.http.get<User>(url, this.httpOptions).pipe(
      map((response: User) => response),
      catchError(this.handleError)
    );
  }

  /**
   * Get Http Headers with token for request
   * @param apiToken The Token to be used in the request
   * @return An `Object` of User
   *
   */
  setHttpOptions(apiToken: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: apiToken,
      }),
    };
    return options;
  }

  /**
   * Get HttpError Responses
   * @param error from HttpClient
   * @return An `Error Message` of Http Client Request
   *
   */
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client Side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server Side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}

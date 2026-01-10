import  {  Injectable  } from  '@angular/core';
import  { HttpClient  }  from  '@angular/common/http';
import  {  Observable  } from  'rxjs';

@Injectable({ providedIn:  'root'  })
export class  AuthService  {
   private  apiUrl  = 'http://localhost:8080/api/auth';
    private tokenKey  =  'auth_token';

   constructor(private  http: HttpClient)  {}

   login(credentials:  {  username: string;  password:  string  }): Observable<any>  {
       return  this.http.post(`${this.apiUrl}/login`, credentials);
    }

    register(user: {  username:  string;  email: string;  password:  string  }): Observable<any>  {
       return  this.http.post(`${this.apiUrl}/register`, user);
    }

    saveToken(token: string):  void  {
       localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string  |  null  {
      return  localStorage.getItem(this.tokenKey);
   }

   logout():  void  {
       localStorage.removeItem(this.tokenKey);
   }

   isAuthenticated():  boolean {
      return true;
      //TODO: enable isAuthenticated
      /*
      return  !!this.getToken();
      */
   }
}

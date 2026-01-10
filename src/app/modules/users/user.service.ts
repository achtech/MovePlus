import  {  Injectable  } from  '@angular/core';
import  {  Observable, of  } from  'rxjs';

export interface  User  {
   id?:  number;
   username:  string;
   email:  string;
   password?:  string;
   role:  string;
   enabled:  boolean;
}

@Injectable({  providedIn:  'root' })
export  class  UserService {
    private users: User[] = [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'ADMIN', enabled: true },
        { id: 2, username: 'kine1', email: 'kine1@example.com', role: 'KINE', enabled: true },
        { id: 3, username: 'assistant', email: 'assistant@example.com', role: 'ASSISTANT', enabled: true },
        { id: 4, username: 'trainer', email: 'trainer@example.com', role: 'TRAINER', enabled: false }
    ];

   constructor()  {}

   getUsers():  Observable<User[]>  {
      return  of(this.users);
   }

   addUser(user:  User):  Observable<User>  {
      user.id = this.users.length + 1;
      this.users.push(user);
      return  of(user);
   }

   updateUser(id:  number,  user: User):  Observable<User>  {
       const index = this.users.findIndex(u => u.id === id);
       if (index !== -1) {
           this.users[index] = { ...user, id };
           return of(this.users[index]);
       }
       return of(null as any);
   }

   deleteUser(id:  number):  Observable<void>  {
      this.users = this.users.filter(u => u.id !== id);
      return  of(void 0);
   }
}

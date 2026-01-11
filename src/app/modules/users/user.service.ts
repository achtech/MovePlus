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
        { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin', role: 'ADMIN', enabled: true },
        { id: 2, username: 'kine1', email: 'kine1@example.com', password: 'kine1', role: 'KINE', enabled: true },
        { id: 3, username: 'assistant', email: 'assistant@example.com', password: 'assistant', role: 'ASSISTANT', enabled: true },
        { id: 4, username: 'trainer', email: 'trainer@example.com', password: 'trainer', role: 'TRAINER', enabled: false },
        { id: 5, username: 'Khalidovic', email: 'khalidovic@example.com', password: 'Move+2026', role: 'ADMIN', enabled: true }
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

   resetPassword(id: number, newPassword?: string): Observable<void> {
       // In a real application, this would call an API to reset the password
       // For now, we'll just simulate the operation
       const user = this.users.find(u => u.id === id);
       if (user) {
           // Use provided new password or fall back to a default
           user.password = newPassword ?? 'reset123';
       }
       return of(void 0);
   }
}

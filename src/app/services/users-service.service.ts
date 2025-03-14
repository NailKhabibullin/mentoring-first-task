import { inject, Injectable } from '@angular/core';
import { UsersApiService } from './users-api-service.service';
import { User } from '../interfaces/users';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersApiService = inject(UsersApiService);
  private usersSubject$ = new BehaviorSubject<User[]>([]);
  readonly users$ = this.usersSubject$.asObservable();

  getUsers(): Observable<User[]>{
    this.usersApiService.getUsers().subscribe(
      (users) => {
        this.usersSubject$.next(users);
      }
    )
    return this.users$
  };

  deleteUser(id:number): void {
    this.usersSubject$.next(
      this.usersSubject$.value.filter(user => user.id !== id))
  };

  createUser(user:User): void {
    if (this.usersSubject$.value.find(email => email.email == user.email) !== undefined) {
      alert("Email is already exist");
    } else {
      const newUser: User = {...user, id: Date.now()};
      this.usersSubject$.next([...this.usersSubject$.value, newUser]);
      console.log("usersService createUser:" , this.usersSubject$.value);
    }
  };

  editUser(updatedUser:User): void {
    this.usersSubject$.next(
      this.usersSubject$.value.map(user =>
        user.id === updatedUser.id ? {...user, ...updatedUser} : user
      )
    );
  };

}

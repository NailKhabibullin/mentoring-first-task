import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersSubject$ = new BehaviorSubject<User[]>([]);
  public readonly users$ = this.usersSubject$.asObservable();

  processUserData(users: User[]): void {
    if (users && users.length > 0) {
      this.usersSubject$.next(users); // Сохраняем полученные данные в свойство users
    } else {
      console.log('Нет данных пользователей');
    }
  }

  getUsersList(): User[] {
    return this.usersSubject$.getValue(); // Возвращаем массив пользователей
  }

  deleteUser(id:number): void {
    // this.usersSubject$.next(this.usersSubject$.value.filter(user => user.id !== id));
    const updatedUsers = this.usersSubject$.getValue().filter(user => user.id !== id);
    this.usersSubject$.next(updatedUsers);
    console.log(`Удаление пользователя с ID: ${id}`);
  }
}

import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersSubject$ = new BehaviorSubject<User[]>([]);      // объявил переменную (subject), в которой данные будут приходить по интерфейсу объекта User
  public readonly users$ = this.usersSubject$.asObservable();   // объявил поток данных, как usersSubject, который можно только читать (asObservable)

  updateUsersList(users: User[]): void {          // метод принимает users по типу User[]
    if (users && users.length > 0) {          // если users приходят и их содержание больше 0, то
      this.usersSubject$.next(users);         // сохраняем полученные данные в subject users с помощью метода RxJS next
    }
  }

  deleteUser(id:number): void {                                                           // объявил метод который принимает параметр id. Метод ничего не возвращает поэтому void
    const updatedUsers = this.usersSubject$.getValue().filter(user => user.id !== id);    // потом берет текущие данные и фильтрует их по условию: юзеры берутся те, у которых id не равен id, который пришел в метод deleteUser
    this.usersSubject$.next(updatedUsers);                                              // next изменяет значения в потоке usersSubject$
  }
}

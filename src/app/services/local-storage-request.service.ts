import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageRequestService {

  constructor() { }

  getFromLocalStorage(key: string): User[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveToLocalStorage(key: string, data: User[]) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  removeItem(id: number): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');    // Получаем список пользователей из localStorage
    const updatedUsers = users.filter((user: any) => user.id !== id);   // Фильтруем массив пользователей, удаляя пользователя с соответствующим id
    localStorage.setItem('users', JSON.stringify(updatedUsers));        // Сохраняем обновленный список обратно в localStorage
  }
}

import { HttpClient } from '@angular/common/http'; //для выполнения HTTP-запросов (GET, POST, PUT, DELETE и т.д.).
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> { // объявил метод который примет данные и сделает их потоком observable с типом данных объекта user  
    return this.http.get<User[]>(`${this.apiUrl}/users`); // get запрос с ожидаемым типом данных объекта user по адресу
  }
}
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from "../user-card/user-card/user-card.component";
import { User } from '../../interfaces/user.interface';
import { UsersApiService } from '../../services/users-api-service.service'; 
import { UsersService } from '../../services/users-service.service';
import { LocalStorageRequestService } from '../../services/local-storage-request.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateEditUserComponent } from '../user-create-editor/create-edit-user/create-edit-user.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ CommonModule,
    UserCardComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit{

  public readonly users$ = this.usersService.users$ // объявлена переменная users$ который использует users$ из usersService, и сама тоже Observable

  constructor (
    private usersApiService: UsersApiService,
    private usersService: UsersService,
    private localStorageRequestService: LocalStorageRequestService,
    private cdr: ChangeDetectorRef  // объявлена зависимость cdr для использования сервиса ChangeDetectorRef
  ) {}

  // ******** Инициализация старницы со карточками users ******** //
  ngOnInit(): void {
    const localUsers = this.localStorageRequestService.getFromLocalStorage('users'); // константа равная запросу на локал сторадж для получения списка юзеров

    if (localUsers && localUsers.length > 0) {            // если локал сторадж есть и не равен 0, то
      this.usersService.updateUsers(localUsers);          // обновляем юзеров в сервисе usersService
      this.cdr.markForCheck()
    } else {
      this.usersApiService.getUsers().subscribe({         // подписываемся на поток из usersApiService с методом getUsers
        next: (data: User[]) => {                         // изменяем его значения
          this.usersService.updateUsers(data);            // обновляем данные в usersService методом updateUsersData
          this.localStorageRequestService.saveToLocalStorage('users', data); // сохраняем юзеров в локал сторадж
          this.cdr.markForCheck();                        // вызов метода из ChangeDetectorRef проверка изменений в компоненте
        },
        error: (err) => {
          console.error('Ошибка при получении пользователей', err);
        }
      });
    }
  }
  
// ******** Удаление карточки user из списка users ******** //
  onDeleteUser(id: number): void { // создаем метод, который принимает параметр id
    this.usersService.deleteUser(id); // обращается к методу deleteUser сервиса usersService
    this.localStorageRequestService.removeItem(id);
  }

  // ******** Редактирование карточки user из списка users ******** //
  onEditUser(user: User): void { // создаем метод, который принимает параметр id
    this.openCreateEditDialog(user);
  }

// ******** Cоздание нового user или редактирование старого ******** //
  readonly dialog = inject(MatDialog);

  openCreateEditDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      data: {
        user: user ? user : { name: '', email: '', phone: '' },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');         // Получаем данные из LocalStorage
        let updatedUsers: User[] = [];
  
        if (user) {
          const index = users.findIndex((u: User) => u.id === user.id);
          if (index !== -1) {
            users[index] = result;                                              // обновляем данные пользователя
            updatedUsers = [...users];                                          // создаем новый массив с обновленными пользователями
          }
        } else {                                                                 // если добавляем нового пользователя
          updatedUsers = [...users, result];                                     // создаем новый массив с добавленным пользователем
        }
        this.usersService.updateUsers(updatedUsers);                            // обновляем данные в usersService
        localStorage.setItem('users', JSON.stringify(updatedUsers));            // обновляем данные в LocalStorage
      }
    });
  }
}

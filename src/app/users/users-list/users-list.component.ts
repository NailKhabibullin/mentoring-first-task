import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from "../user-card/user-card/user-card.component";
import { User } from '../../interfaces/user.interface';
import { UsersApiService } from '../../services/users-api-service.service'; 
import { UsersService } from '../../services/users-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditUserComponent } from '../user-create-editor/create-edit-user/create-edit-user.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit{
  users: User[] = [];

  constructor (
    private usersApiService: UsersApiService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.users = users;
    });

    this.usersApiService.getUsers().subscribe({
      next: (data: User[]) => {
        this.usersService.processUserData(data);
      },
      error: (err) => {
        console.error('Ошибка при получении пользователей', err);
      }
    });
  }

  onDeleteUser(id: number): void {
    this.usersService.deleteUser(id);
  }

  dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(CreateEditUserComponent, {
      data: {
        users: this.users,
      },
    });
  }
}

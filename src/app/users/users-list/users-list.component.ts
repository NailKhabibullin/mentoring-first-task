import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from "../user-card/user-card/user-card.component";
import { User } from '../../interfaces/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateEditUserComponent } from '../user-create-editor/create-edit-user/create-edit-user.component';
import { Store } from '@ngrx/store';
import { addUser, deleteUser, editUser, editUserFailure, editUserSuccess, getUsersList } from '../../states/users/users.actions';
import { selectGetUsersList } from '../../states/users/users.selectors';

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
  private store = inject(Store);
  public readonly users$ = this.store.select(selectGetUsersList)
 
  // ******** Инициализация старницы со карточками users ******** //
  ngOnInit(): void {
    this.store.dispatch(getUsersList());
  }
  
// ******** Удаление карточки user из списка users ******** //
  onDeleteUser(id: number): void { // создаем метод, который принимает параметр id
    this.store.dispatch(deleteUser({id}));
  }

  // ******** Редактирование карточки user из списка users ******** //
  onEditUser(user: User): void { // создаем метод, который принимает параметр id
    this.store.dispatch(editUser({user}));
    this.openCreateEditDialog(user)
  }

// ******** Cоздание нового user или редактирование старого ******** //
  readonly dialog = inject(MatDialog);

  openCreateEditDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      data: {
        user: user ? user : { name: '', email: '', phone: '' },
      }
    });
    dialogRef.afterClosed().subscribe(userData => {
      if (userData) {
        if (user) {
          this.store.dispatch(editUserSuccess({ user: { ...user, ...userData } }));
        } else {
          const newUserId = this.generateNewUserId();
          this.store.dispatch(addUser({ user: { ...userData, id: newUserId } }));
        }
      } else {
        this.store.dispatch(editUserFailure({ error: 'User edit error' }));
      }
    });
  }

  private generateNewUserId(): number {
    let maxId = 0;
    this.store.select(selectGetUsersList).subscribe(users => {
      maxId = users.length ? Math.max(...users.map(user => user.id)) : 0;
    });
    return maxId + 1;
  }
}

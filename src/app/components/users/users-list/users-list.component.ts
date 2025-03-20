import { Component, inject } from '@angular/core';
import { User } from '../../../interfaces/users'; 
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';
import { Store } from '@ngrx/store';
import { selectUsers } from '../../../state/users/users.selectors';
import { createUser, deleteUser, editUser, loadUsers } from '../../../state/users/users.action';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AsyncPipe,
    UserCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {

  private store = inject(Store);
  readonly dialog = inject(MatDialog);
  users$ = this.store.select(selectUsers);

  ngOnInit(): void {
    this.users$.pipe(
      first(users => users.length === 0)
    ).subscribe(() => {
      this.store.dispatch(loadUsers());
    });
  }

  openDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {data: {user}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.id !== null 
          ? this.store.dispatch(editUser({ user: result })) 
          : this.store.dispatch(createUser({ user: result }));
      }
    });
  }

  deleteUser(id:number): void {
    this.store.dispatch(deleteUser({ id }))
  }

  editUser(user:User):void {
    this.openDialog(user)
  }
}

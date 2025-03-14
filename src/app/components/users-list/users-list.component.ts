import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { User } from '../../interfaces/users';
import { NgFor } from '@angular/common';
import { UsersService } from '../../services/users-service.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    NgFor,
    UserCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {

  readonly usersService = inject(UsersService);
  readonly dialog = inject(MatDialog);
  users: User[] = [];

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(
      (users) => {
        this.users = users
      }
    )
  }

  openDialog(user?: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {data: {user}});

    dialogRef.afterClosed().subscribe(result => {
      result ? (result.id !== null ? this.usersService.editUser(result) : this.usersService.createUser(result)) : null;
    });
  }

  deleteUser(id:number): void {
    this.usersService.deleteUser(id)
  }

  editUser(user:User):void {
    this.openDialog(user)
  }
}

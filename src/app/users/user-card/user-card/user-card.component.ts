import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ MatButtonModule ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() deleteUser = new EventEmitter<number>();
  @Output() editUser = new EventEmitter<number>();

  onDelete(): void {
    this.deleteUser.emit(this.user.id);
  }

  onEdit(): void {
    this.editUser.emit(this.user.id);
  }
}

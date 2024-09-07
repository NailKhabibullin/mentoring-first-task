import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() deleteUser = new EventEmitter<number>();

  onDelete(): void {
    console.log(`Клик по кнопке удаления для пользователя с ID: ${this.user.id}`);
    if (this.user?.id) {
      this.deleteUser.emit(this.user.id);
    }
  }
}

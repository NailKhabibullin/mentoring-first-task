import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss'
})
export class CreateEditUserComponent {
  data = inject(MAT_DIALOG_DATA);

  onCreate(): void {
    console.log(`Клик по кнопке`);
  }
}

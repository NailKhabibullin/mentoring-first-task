import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss'
})
export class CreateEditUserComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateEditUserComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly user = signal(this.data.user);

  onNoClick(): void {
    this.dialogRef.close();
  }

  createEditForm: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { 
    this.createEditForm = this.fb.group({
      id: [''],
      name: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]], 
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],  
    });
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.generateId();
      this.createEditForm.patchValue(this.data.user);
    }
  }

  generateId(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const maxId = users.length ? Math.max(...users.map((user: any) => user.id)) : 0;
    this.createEditForm.patchValue({ id: maxId + 1 });
  }

  onSubmit(): void {
    const formData = this.createEditForm.value;
    this.dialogRef.close(formData);
  }
}

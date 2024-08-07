import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../services/data/data-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './user-details-edit.component.html',
  styleUrl: './user-details-edit.component.scss'
})
export class UserDetailsEditComponent {

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDetailsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.userForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      phone: [data.phone, [Validators.required, Validators.pattern(/^\+9725[0-9]{8}$/)]],
      website: [data.website, [Validators.pattern(/^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/.+)?$/)]],
      email: [{ value: data.email, disabled: true }]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close({ ...this.data, ...this.userForm.value });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

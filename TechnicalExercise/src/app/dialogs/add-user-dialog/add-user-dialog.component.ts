import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/model/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserType } from 'src/app/model/UserType';
import { StringPair } from 'src/app/model/StringPair';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  public userForm: FormGroup;
  public nameControl: FormControl;
  public emailControl: FormControl;
  public typeControl: FormControl;
  public userTypes: StringPair[];
  public currentUsers: User[];

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snacbarService: SnackbarService
    ) { }

  ngOnInit(): void {
    Object.keys(UserType).forEach(value => {
      if (!this.userTypes) { this.userTypes = []; }
      this.userTypes.push(new StringPair(value, UserType[value]));
    });

    this.currentUsers = this.data.users;

    this.nameControl = new FormControl('', [Validators.required]);
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.typeControl = new FormControl('', [Validators.required]);

    this.userForm = new FormGroup({
      name: this.nameControl,
      email: this.emailControl,
      type: this.typeControl
    });
  }

  getErrorMessage() {
    if (this.emailControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.emailControl.hasError('email') ? 'Not a valid email' : '';
  }

  createUser(user) {
    // This check should be done in back...
    if (this.currentUsers.find(u => u.email === user.email)) {
      this.snacbarService.displayMessage('The email is already in use.');
      return;
    } else {
      this.dialogRef.close(user);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

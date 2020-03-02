import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/services/user.service';
import { UserType } from 'src/app/model/UserType';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from 'src/app/dialogs/add-user-dialog/add-user-dialog.component';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;

  public mainSubscription: Subscription;

  public users: User[];

  public usersToDisplay: MatTableDataSource<User>;

  public columnsToDisplay: string[] = ['name', 'email', 'type', 'actions'];

  constructor(
    public userService: UserService,
    public snackbarService: SnackbarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.mainSubscription = new Subscription();
    this.usersToDisplay = new MatTableDataSource<User>();

    const userSubscription = this.userService.getUsers().subscribe(users => {
      this.users = users;
      // Assign to a new object instance or the table won't update
      this.usersToDisplay.data = this.users;
    });
    this.mainSubscription.add(userSubscription);
  }

  // ngAfterViewInit because if not this.filterInput and this.paginator would be undefined
  ngAfterViewInit(): void {
    this.usersToDisplay.paginator = this.paginator;

    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        })
        , debounceTime(500)
        , distinctUntilChanged()
      ).subscribe(input => {
        if (!input) {
          this.usersToDisplay.data = this.users;
        } else {
          // Search in both email and table columns
          const users = this.users.filter(u => u.email.includes(input) || u.name.includes(input));
          // Assign to a new object instance or the table won't update
          this.usersToDisplay.data = users;
        }
      });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(confirmation => {
      if (confirmation) {
        // This check should be done in back too.
        if (!this.users.filter(u => u !== user).find(u => u.type === UserType.Admin)) {
          this.snackbarService.displayMessage('Operation canceled. There should be at least one admin user.');
          return;
        } else {
          this.userService.httpDeleteUser(user);
        }
      }
    });
  }

  addNewUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: {
        users: this.users
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const email = result.email;
      const newUser = new User(result.name, result.email, UserType[result.type]);
      this.userService.httpPostUser(newUser);
    });
  }

  ngOnDestroy(): void {
    // Performance improvements
    this.mainSubscription.unsubscribe();
  }
}

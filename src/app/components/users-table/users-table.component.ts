import { Component, OnInit } from '@angular/core';
import { DataServiceService, User } from '../../services/data/data-service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailsEditComponent } from '../user-details-edit/user-details-edit.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})

export class UsersTableComponent implements OnInit {
  users: User[] = [];
  columnSorting: string = '';
  AscendingSort: boolean = true;
  lastTapTime: number = 0;

  displayedColumns: string[] = ['name', 'email', 'phone', 'website'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  constructor(
    private dataService: DataServiceService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        this.dataSource.data = users;
      },
      err => { console.error('error fetching users', err); })
  }

  sort(column: string): void {
    console.log('sort click', column);

    if (this.columnSorting === column) {
      this.AscendingSort = !this.AscendingSort;
    } else {
      this.columnSorting = column;
      this.AscendingSort = true;
    }

    this.users.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      if (valueA < valueB) {
        return this.AscendingSort ? -1 : 1;
      } else if (valueA > valueB) {
        return this.AscendingSort ? 1 : -1;
      } else {
        return 0;
      }
    });
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      if (valueA < valueB) {
        return this.AscendingSort ? -1 : 1;
      } else if (valueA > valueB) {
        return this.AscendingSort ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  onRowDoubleClick(user: User): void {
    const dialogRef = this.dialog.open(UserDetailsEditComponent, {
      width: '600px',
      height: '300px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
          this.dataSource.data = [...this.users];
        }
      }
    });
  }

  onRowClick(user: User): void {
    const currentTime = new Date().getTime();
    const tapInterval = currentTime - this.lastTapTime;

    if (tapInterval < 300) { // Double-tap detected
      this.onRowDoubleClick(user);
    }

    this.lastTapTime = currentTime;
  }
}
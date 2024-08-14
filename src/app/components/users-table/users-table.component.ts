import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataServiceService, User } from '../../services/data/data-service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetailsEditComponent } from '../user-details-edit/user-details-edit.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})

export class UsersTableComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  columnSorting: string = '';
  AscendingSort: boolean = true;
  lastTapTime: number = 0;

  displayedColumns: string[] = ['name', 'email', 'phone', 'website'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dataService: DataServiceService,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        this.dataSource.data = users;
      },
      err => { console.error('error fetching users', err); });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onRowDoubleClick(user: User): void {
    const dialogRef = this.dialog.open(UserDetailsEditComponent, {
      width: '600px',
      height: '500px',
      disableClose: true,
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
    if (tapInterval < 300) {
      this.onRowDoubleClick(user);
    }
    this.lastTapTime = currentTime;
  }
}
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AuthorService } from '../../services/author.service';
import { IAuthor } from '../../models/author.model';

@Component({
  selector: 'app-authors-grid-page',
  templateUrl: './authors-grid-page.component.html',
  styleUrls: ['./authors-grid-page.component.css'],
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule
  ]
})
export class AuthorsGridPageComponent {
  public columnDefs: ColDef[] = [
    { field: 'authorId', headerName: 'Author ID', sortable: true, filter: true },
    { field: 'firstName', headerName: 'First Name', sortable: true, filter: true },
    { field: 'lastName', headerName: 'Last Name', sortable: true, filter: true },
    { field: 'penName', headerName: 'Pen Name', sortable: true, filter: true }
  ];

  public rowData: IAuthor[] = [];

  public paginationPageSize = 20;
  constructor(private authorService: AuthorService) {}
  ngOnInit() {
    this.loadData();
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  loadData() {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.rowData = data;
      },
      error: (err) => {
        console.error('Error loading authors:', err);
      }
    });
  }
}

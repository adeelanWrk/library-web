// book-table.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css'],
  imports: [CommonModule, AgGridModule]

})
export class BookTableComponent implements OnInit {
  @Input() paginationPageSize = 10;

  public columnDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', sortable: true },
    { field: 'author', headerName: 'Author', sortable: true },
    { field: 'publisher', headerName: 'Publisher', sortable: true },
    { field: 'price', headerName: 'Price', sortable: true }
  ];

  public rowData: any[] = [];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks() {
    this.http.get<any[]>('/api/books').subscribe(data => {
      this.rowData = data;
    });
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }
}

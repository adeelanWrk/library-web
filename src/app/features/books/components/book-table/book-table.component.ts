import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular'; // อย่าลืม import AgGridModule
import { ColDef, GridApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { BookService } from '../../services/book.service';
import { BookSummary } from '../../models/book-summary.model';
import { PagedResult } from '../../models/paged-result.model';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css']
})
export class BookTableComponent implements OnInit {
  public rowData: BookSummary[] = [];
  public columnDefs: ColDef[] = [
    { field: 'title', headerName: 'ชื่อหนังสือ', sortable: true, filter: true },
    { field: 'authors', headerName: 'ชื่อผู้แต่ง', sortable: true, filter: true },
    { field: 'authorCount', headerName: 'จำนวนผู้แต่ง', sortable: true, filter: true, width: 150 }
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  public gridApi!: GridApi; // AG-Grid API instance
  public paginationPageSize = 5; // ตั้งค่าเริ่มต้นให้แสดง 5 เล่มต่อหน้า
  public cacheBlockSize = 5; // ควรเท่ากับ paginationPageSize หรือมากกว่า
  public rowModelType = 'serverSide'; // สำคัญมากสำหรับ Server-Side Pagination/Sorting

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // ไม่มีข้อมูลเริ่มต้นตรงนี้ เพราะจะโหลดผ่าน datasource ของ AG-Grid
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    const datasource: IServerSideDatasource = this.createServerSideDatasource(this.bookService);
    params.api.setServerSideDatasource(datasource);
  }

  private createServerSideDatasource(bookService: BookService): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const { request, successCallback, failCallback } = params;

        // คำนวณ page number จาก startRow และ endRow
        const currentPage = Math.floor(request.startRow / this.paginationPageSize) + 1;
        const pageSize = request.endRow - request.startRow;

        // ดึงข้อมูลการเรียงลำดับ
        let sortBy = '';
        let sortDirection = '';
        if (request.sortModel && request.sortModel.length > 0) {
          sortBy = request.sortModel[0].colId;
          sortDirection = request.sortModel[0].sort;
        }

        console.log(`Requesting page ${currentPage}, size ${pageSize}, sortBy: ${sortBy}, direction: ${sortDirection}`);

        bookService.getBooksPaged(currentPage, pageSize, sortBy, sortDirection).subscribe({
          next: (pagedResult: PagedResult<BookSummary>) => {
            if (pagedResult && pagedResult.items) {
              successCallback(pagedResult.items, pagedResult.totalCount);
            } else {
              successCallback([], 0); // ไม่มีข้อมูล
            }
          },
          error: (err) => {
            console.error('Error fetching data from server: ', err);
            failCallback();
            // Optional: show a user-friendly error message
          }
        });
      },
    };
  }

  // AG-Grid จะจัดการการเรียก getRows() เองเมื่อมีการเปลี่ยนหน้าหรือเรียงลำดับ
  // ไม่จำเป็นต้องมี onPaginationChanged หรือ onSortChanged แยกต่างหากถ้าใช้ Server-Side Datasource
}
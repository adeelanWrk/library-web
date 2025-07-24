import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowModelType,
} from "ag-grid-community";
import { IBook } from "../../models/book-grid-model";
import { CommonModule } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { IResult } from "../../../core/model";
ModuleRegistry.registerModules([
  InfiniteRowModelModule
]);

@Component({
  selector: 'app-books-grid-page',
  templateUrl: './books-grid-page.component.html',
  styleUrls: ['./books-grid-page.component.css'],
  standalone: true,
  imports: [CommonModule,AgGridAngular],
})
export class BooksGridPageComponent {
    private baseUrl = environment.apiBaseUrl + '/books';

  isLoading = false;
  columnDefs: ColDef[] = [
    { field: "bookId", headerName: "Book ID" },
    { field: "title", headerName: "Title" },
    { field: "publisher", headerName: "Publisher" ,spanRows: true, sort: "asc"},
    { field: "price", headerName: "Price" }
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
  };
  rowBuffer = 0;
  rowModelType: RowModelType = "infinite";
  cacheBlockSize = 100;
  cacheOverflowSize = 2;
  maxConcurrentDatasourceRequests = 1;
  infiniteInitialRowCount = 1000;
  maxBlocksInCache = 10;
  rowData!: IBook[];

  constructor(private http: HttpClient) { }

  onGridReady(params: GridReadyEvent<IResult<IBook[]>>) {
    this.http
      .get<
        IResult<IBook[]>
      >(`${this.baseUrl}/infinite`)
      .subscribe((res) => {
        console.log(res, "res");
        const dataSource: IDatasource = {
          rowCount: undefined,
          getRows: (params: IGetRowsParams) => {
            setTimeout(() => {
              const rowsThisPage = res?.data!.slice(params.startRow, params.endRow);
              let lastRow = -1;
              if (res?.data!.length <= params.endRow) {
                lastRow = res?.data!.length;
              }
              params.successCallback(rowsThisPage, lastRow);
            }, 500);
          },
        };
        params.api!.setGridOption("datasource", dataSource);
      });
  }
  
}

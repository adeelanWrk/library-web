import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title-cell-renderer',
  template: `
    <span
      
      (click)="goToDetail()"
    >
      {{ value }}
    </span>
  `,
  standalone: true,
  imports: [],
})
// style="text-decoration: underline; color: #1976d2; cursor: pointer;"
export class TitleCellRendererComponent implements ICellRendererAngularComp {
  value: any;
  bookId!: number;

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.value = params.value;
    this.bookId = params.data.bookId;
  }

  refresh(): boolean {
    return false;
  }

  goToDetail(): void {
    console.log('Navigating to book detail for bookId:', this.bookId);
    this.router.navigate(['/books', this.bookId]);
  }
}

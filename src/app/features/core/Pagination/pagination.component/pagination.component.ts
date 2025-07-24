import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IPaginationProperties } from '../model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaginationComponent implements OnChanges {
  @Input() paginationProperties!: IPaginationProperties;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageArray: (number | '...')[] = [];

  get pageSizeOptions(): number[] {
    return this.paginationProperties.pageSizeOptions ?? [10, 20, 50, 100];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginationProperties']) {
      this.generatePageArray();
    }
  }

  generatePageArray() {
    const { page, totalPages } = this.paginationProperties;
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for(let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page <= 4) {
        for(let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (page >= totalPages - 3) {
        pages.push('...');
        for(let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('...');
      }

      pages.push(totalPages);
    }

    this.pageArray = pages;
  }

  goToPage(page: number | '...') {
    if (page === '...') return;

    if (!this.paginationProperties) return;

    if (page < 1 || page > this.paginationProperties.totalPages) return;

    this.pageChange.emit(page);
  }

  onPageSizeChange(newPageSize: string) {
    const size = Number(newPageSize);
    if (this.pageSizeOptions.includes(size)) {
      this.pageSizeChange.emit(size);
    }
  }

  onSelectChange(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  const value = target?.value;

  if (value) {
    this.onPageSizeChange(value);
    // const size = Number(value);
    // if (this.pageSizeOptions.includes(size)) {
    //   this.pageSizeChange.emit(size);
    // }
  }
}

}

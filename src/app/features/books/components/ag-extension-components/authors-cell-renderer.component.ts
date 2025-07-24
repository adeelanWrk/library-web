import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // <-- import นี้ต้องมี
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-authors-cell-renderer',
    standalone: true,
    imports: [CommonModule],  // <-- ต้องเพิ่ม CommonModule ด้วย
    template: `
    <div class="flex flex-col gap-1">
      <span
        *ngFor="let author of authors"
        class="text-blue-600 underline cursor-pointer hover:text-blue-800"
        (click)="goToAuthor(author.authorId)"
      >
        {{ author.firstName }} {{ author.lastName }}
      </span>
      <div *ngIf="authors.length === 0">No authors</div>
    </div>
  `
})
export class AuthorsCellRendererComponent implements ICellRendererAngularComp {
    authors: any[] = [];

    constructor(private router: Router) { }

    agInit(params: any): void {
        console.log('Authors raw data:', params.data.authors);
        this.authors = Array.isArray(params.data.authors) ? params.data.authors : [];
    }


    refresh(): boolean {
        return false;
    }

    goToAuthor(authorId: number) {
        this.router.navigate(['/authors', authorId]);
    }
}

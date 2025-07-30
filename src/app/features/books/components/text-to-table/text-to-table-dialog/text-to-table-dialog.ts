import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { IBookWithAuthorsMuiTextToTable } from '../../../models/book-overiew-mui-model';
import { AlertService } from '../../../../core/alert/alert.service';
import { BookService } from '../../../services/book.service';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-text-to-table-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './text-to-table-dialog.html',
  styleUrls: ['./text-to-table-dialog.css']
})
export class TextToTableDialogComponent {
  tableData: string[][] = [];
  parsedBooks: IBookWithAuthorsMuiTextToTable[] = [];
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TextToTableDialogComponent>,
    private sw: AlertService,
    private services: BookService
  ) { }

  onInputChange(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    const rawText = input.value;

    const rows = rawText.trim().split(/\r?\n/).map(r => r.split('\t'));
    this.tableData = rows;

    if (rows.length < 2) return;

    const data: IBookWithAuthorsMuiTextToTable[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      const bookId = parseInt(row[0]);
      const title = row[1]?.trim() || null;
      const publisher = row[2]?.trim() || null;
      const price = parseFloat(row[3]);
      const authorId = parseInt(row[4]);
      const firstName = row[5]?.trim() || '';
      const lastName = row[6]?.trim() || '';
      const penName = row[7]?.trim() || '';

      if (isNaN(bookId) || isNaN(authorId)) {
        this.sw.error(`Row ${i + 1} is missing required fields: BookId or AuthorId.`);
        this.parsedBooks = [];
        return;
      }

      data.push({
        bookId,
        title,
        publisher,
        price: isNaN(price) ? null : price,
        authorId,
        firstName,
        lastName,
        penName
      });
    }

    this.parsedBooks = data;
    // console.log('Parsed:', this.parsedBooks);
  }


  save(): void {
    this.isLoading = true;
    this.services.updateRawData(this.parsedBooks).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => this.handleSuccessfulResponse(response),
      error: (error) => {
        this.sw.error(error || 'Failed to update raw data');
      }
    });
  }

  private handleSuccessfulResponse(response: any): void {
    if (!response || response.status !== 200) {
      this.sw.error(response?.desc || 'Failed to update raw data');
      return;
    }
    this.sw.success(response.desc);
    this.close(true);
  }
  close(reload: boolean = false): void {
    this.dialogRef.close(reload);
  }
}
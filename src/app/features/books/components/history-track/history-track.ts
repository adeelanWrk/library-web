import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../../core/alert/alert.service';
import { BookService } from '../../services/book.service';

export interface IBookRow {
  updatedDate?: Date;
  title: string;
  publisher: string | null;
  price: number | null;
  authors: string;
  authorCount: number;

}
export interface IRequestParamHistory {
  authorId: number;
  bookId: number;
}


@Component({
  selector: 'app-history-track',
  templateUrl: './history-track.html',
  styleUrls: ['./history-track.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
})
export class HistoryTrackComponent {
  data: IBookRow[] = [];
  dataLength = 0;
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<HistoryTrackComponent>,
    private sw: AlertService,
    private services: BookService,
    @Inject(MAT_DIALOG_DATA) public dialogData: IRequestParamHistory
  ) {
    this.loadData();
  }
  loadData() {
    this.isLoading = true;
    this.data = [];
    this.services.getHistoryTrack(this.dialogData).subscribe({
      next: (res) => {
        this.data = res.data;
        this.dataLength = this.data.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.sw.error(err);
        this.isLoading = false;
      }
    });
  }

  getCellClass(index: number, key: keyof IBookRow): string {
    if (index === this.dataLength - 1) return 'bg-white';
    const current = this.data[index][key];
    const previous = this.data[index + 1][key];
    return current !== previous ? 'bg-yellow-200' : 'bg-white';
  }

  close() {
    this.dialogRef.close();
  }
}

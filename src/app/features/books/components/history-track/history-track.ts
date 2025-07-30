import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../../core/alert/alert.service';
import { BookService } from '../../services/book.service';

export interface BookRow {
  updatedDate?: Date;
  title: string;
  publisher: string | null;
  price: number | null;
  authors: string;
  authorCount: number;

}


@Component({
  selector: 'app-history-track',
  templateUrl: './history-track.html',
  styleUrls: ['./history-track.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
})
export class HistoryTrackComponent {
  data: BookRow[] = Array.from({ length: 100 }, (_, i) => ({
    title: `Book ${i + 1}`,
    authors: `Author ${i + 1}`,
    authorCount: 1,
    publisher: `Publisher ${i + 1}`,
    price: 100 + i,
  }));
  dataLength = this.data.length;
  constructor(
    public dialogRef: MatDialogRef<HistoryTrackComponent>,
    private sw: AlertService,
    private services: BookService
  ) { }


  getCellClass(index: number, key: keyof BookRow): string {
    if (index === this.dataLength - 1) return 'bg-white';


    const current = this.data[index][key];
    const previous = this.data[index + 1][key];
    // console.log(`Current: ${current}, Previous: ${previous}`);
    return current !== previous ? 'bg-yellow-200' : 'bg-white';
  }


  close() {
    this.dialogRef.close();
  }
}

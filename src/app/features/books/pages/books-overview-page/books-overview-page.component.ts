import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookSummary } from '../../models/book-summary.model';

@Component({
  selector: 'app-books-overview-page',
  templateUrl: './books-overview-page.component.html',
  styleUrls: ['./books-overview-page.component.css']
})
export class BooksOverviewPageComponent implements OnInit {
  books: BookSummary[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // โหลดหนังสือทั้งหมดเริ่มต้น (หรือจะให้โหลดเฉพาะเมื่อเลือกผู้แต่งก็ได้)
    // สำหรับตอนนี้เราจะให้โหลดเมื่อเลือกผู้แต่งเท่านั้น
    // หากต้องการโหลดทั้งหมดเมื่อเข้าหน้าครั้งแรก ให้เรียก bookService.getBooksPaged() โดยไม่ต้องมี authorId
  }

  onAuthorSelected(authorId: number | null): void {
    if (authorId !== null) {
      this.isLoading = true;
      this.errorMessage = null;
      // ในที่นี้สมมติว่า API ของคุณรองรับการกรองตาม AuthorId
      // หาก API getBooksPaged ไม่มี parameter authorId คุณอาจต้องเพิ่มเมธอดใหม่ใน BookService เช่น getBooksByAuthorId(authorId)
      // หรือปรับแก้ URL ใน BookService ให้รองรับ Query parameter `authorId`
      this.bookService.getBooksPaged(1, 100, '', '').subscribe({ // ดึงทั้งหมด 100 เล่มสำหรับแสดงในหน้านี้ (ไม่มี pagination/sorting)
        next: (pagedResult) => {
          // ในกรณีที่คุณมี API ที่กรองตาม authorId ได้
          // ตัวอย่าง: this.bookService.getBooksByAuthorId(authorId).subscribe(...)
          // สำหรับตอนนี้ เราจะกรองจากข้อมูลที่ดึงมาทั้งหมด หาก Backend ไม่มี Endpoint แยก
          this.books = pagedResult.items.filter(book => book.authors.includes(authorId.toString())); // ต้องปรับ logic การกรองให้เหมาะสมกับโครงสร้างข้อมูลจริง
          // หรือถ้า Backend API สามารถกรองให้ได้ จะดีกว่า
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching books by author', err);
          this.errorMessage = 'ไม่สามารถดึงข้อมูลหนังสือได้ โปรดลองอีกครั้ง';
          this.isLoading = false;
          this.books = []; // Clear books on error
        }
      });
    } else {
      this.books = []; // ถ้าเลือก "เลือกผู้แต่ง" ให้ล้างรายการหนังสือ
    }
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksSummaryPage } from './books-summary-page.component';

describe('BooksSummaryPage', () => {
  let component: BooksSummaryPage;
  let fixture: ComponentFixture<BooksSummaryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksSummaryPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

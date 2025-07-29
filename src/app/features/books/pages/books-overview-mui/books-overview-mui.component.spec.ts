import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksOverviewMuiComponent } from './books-overview-mui.component';


describe('BooksOverviewMuiComponent', () => {
  let component: BooksOverviewMuiComponent;
  let fixture: ComponentFixture<BooksOverviewMuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooksOverviewMuiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksOverviewMuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

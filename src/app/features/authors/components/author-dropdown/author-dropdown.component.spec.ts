import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorDropdownComponent } from './author-dropdown.component';


describe('AuthorDropdownComponent', () => {
  let component: AuthorDropdownComponent;
  let fixture: ComponentFixture<AuthorDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

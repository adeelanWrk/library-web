import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTrackComponent } from './history-track';

describe('HistoryTrackComponent', () => {
  let component: HistoryTrackComponent;
  let fixture: ComponentFixture<HistoryTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

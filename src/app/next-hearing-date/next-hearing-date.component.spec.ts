import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextHearingDateComponent } from './next-hearing-date.component';

describe('NextHearingDateComponent', () => {
  let component: NextHearingDateComponent;
  let fixture: ComponentFixture<NextHearingDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextHearingDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextHearingDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

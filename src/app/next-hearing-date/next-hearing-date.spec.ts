import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextHearingDate } from './next-hearing-date';

describe('NextHearingDate', () => {
  let component: NextHearingDate;
  let fixture: ComponentFixture<NextHearingDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextHearingDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextHearingDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

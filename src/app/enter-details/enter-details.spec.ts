import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDetails } from './enter-details';

describe('EnterDetails', () => {
  let component: EnterDetails;
  let fixture: ComponentFixture<EnterDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

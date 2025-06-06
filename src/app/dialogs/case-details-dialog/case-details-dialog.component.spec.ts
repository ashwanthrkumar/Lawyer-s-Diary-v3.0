import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsDialogComponent } from './case-details-dialog.component';

describe('CaseDetailsDialogComponent', () => {
  let component: CaseDetailsDialogComponent;
  let fixture: ComponentFixture<CaseDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

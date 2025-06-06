import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCaseClientComponent } from './add-case-client.component';

describe('AddCaseClientComponent', () => {
  let component: AddCaseClientComponent;
  let fixture: ComponentFixture<AddCaseClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCaseClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCaseClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

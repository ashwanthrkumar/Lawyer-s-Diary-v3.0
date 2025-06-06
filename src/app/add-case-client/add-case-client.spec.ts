import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCaseClient } from './add-case-client';

describe('AddCaseClient', () => {
  let component: AddCaseClient;
  let fixture: ComponentFixture<AddCaseClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCaseClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCaseClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackManagement } from './pack-management';

describe('PackManagement', () => {
  let component: PackManagement;
  let fixture: ComponentFixture<PackManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

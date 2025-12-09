import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPickerDialogComponent } from './animal-picker-dialog.component';

describe('AnimalPickerDialogComponent', () => {
  let component: AnimalPickerDialogComponent;
  let fixture: ComponentFixture<AnimalPickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalPickerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

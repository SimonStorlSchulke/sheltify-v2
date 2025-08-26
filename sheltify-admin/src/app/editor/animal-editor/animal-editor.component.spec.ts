import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalEditorComponent } from './animal-editor.component';

describe('AnimalEditorComponent', () => {
  let component: AnimalEditorComponent;
  let fixture: ComponentFixture<AnimalEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

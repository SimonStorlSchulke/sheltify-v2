import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSectionEditorComponent } from './text-section-editor.component';

describe('TextSectionEditorComponent', () => {
  let component: TextSectionEditorComponent;
  let fixture: ComponentFixture<TextSectionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSectionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    fixture.componentRef.setInput('tag', { ID: '1', Name: 'Notfall', Color: '#ff0000' });
    fixture.detectChanges();
  });

  it('shows the tag name', () => {
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('Notfall');
  });
});

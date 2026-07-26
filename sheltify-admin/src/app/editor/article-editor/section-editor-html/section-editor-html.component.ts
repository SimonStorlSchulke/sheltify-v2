import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Highlight } from 'ngx-highlightjs';
import { SectionHtml } from 'sheltify-lib/article-types';

@Component({
  selector: 'app-section-editor-html',
  imports: [Highlight, FormsModule],
  templateUrl: './section-editor-html.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-html.component.scss',
})
export class SectionEditorHtmlComponent implements AfterViewChecked  {
  section = input.required<SectionHtml>();

  html = output<SectionHtml>();

  textarea = viewChild<ElementRef>('textarea');
  wrapper = viewChild<ElementRef>('wrapper');

  onInput(event: Event) {
    this.section().Content.Html = (event.target as HTMLTextAreaElement).value;
    this.adjustTextareaHeight();
  }

  ngAfterViewChecked() {
    this.adjustTextareaHeight();
  }

  private adjustTextareaHeight() {
    const minHeight = 100;
    this.textarea()!.nativeElement.style.height = "auto";
    this.textarea()!.nativeElement.style.height = (this.textarea()!.nativeElement.scrollHeight || minHeight) + "px";
    this.wrapper()!.nativeElement.style.height = "auto";
    this.wrapper()!.nativeElement.style.height = (this.textarea()!.nativeElement.scrollHeight || minHeight) + "px";
  }
}

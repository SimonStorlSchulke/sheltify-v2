import { AfterViewInit, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SectionHtml } from 'sheltify-lib/article-types';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-section-editor-html',
  imports: [Highlight, FormsModule],
  templateUrl: './section-editor-html.component.html',
  styleUrl: './section-editor-html.component.scss',
})
export class SectionEditorHtmlComponent implements AfterViewInit {
  section = input.required<SectionHtml>();

  html = output<SectionHtml>();

  textarea = viewChild<ElementRef>('textarea');
  wrapper = viewChild<ElementRef>('wrapper');

  protected onInput(event: Event) {
    this.section().Content.Html = (event.target as HTMLTextAreaElement).value;
    this.adjustTextareaHeight();
  }

  ngAfterViewInit() {
    setTimeout(() => this.adjustTextareaHeight(), 0);
  }

  private adjustTextareaHeight() {

    this.textarea()!.nativeElement.style.height = "auto";
    this.textarea()!.nativeElement.style.height = this.textarea()!.nativeElement.scrollHeight + "px";
    this.wrapper()!.nativeElement.style.height = "auto";
    this.wrapper()!.nativeElement.style.height = this.textarea()!.nativeElement.scrollHeight + "px";
  }
}

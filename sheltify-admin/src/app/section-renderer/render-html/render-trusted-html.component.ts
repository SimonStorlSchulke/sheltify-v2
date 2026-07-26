import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-render-trusted-html',
  imports: [],
  templateUrl: './render-trusted-html.component.html',
  styleUrl: './render-trusted-html.component.scss',
})
export class RenderTrustedHtmlComponent {
  private domSanitizer = inject(DomSanitizer);
  html = input.required<string>();

  desanitizedHtml = computed(() => {
    return this.domSanitizer.bypassSecurityTrustHtml(this.html())
  })
}

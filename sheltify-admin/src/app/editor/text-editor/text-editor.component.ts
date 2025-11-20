import { Component } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { schema } from 'ngx-editor/schema';

@Component({
    selector: 'app-text-editor',
    imports: [NgxEditorModule, FormsModule],
    templateUrl: './text-editor.component.html',
    styleUrl: './text-editor.component.scss'
})
export class TextEditorComponent {
  editor: Editor;
  html = '';


  constructor() {
    this.editor = new Editor({
      content: '',
      plugins: [],
      nodeViews: {},
      history: true,
      schema,
      keyboardShortcuts: true,
      inputRules: true,
    });
  }

  parse() {
    console.log(this.html);
  }

}

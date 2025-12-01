import { Component, effect, model, OnInit, output } from '@angular/core';
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
export class TextEditorComponent implements OnInit {
  editor: Editor;

  htmlModel = model<string>('');
  html: string = "";

  htmlInput = output<string>();

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

  public ngOnInit() {
    this.html = this.htmlModel();
  }

  public onChange(value: string) {
    this.html = value;
    this.htmlModel.set(value);
    this.htmlInput.emit(value);
  }
}

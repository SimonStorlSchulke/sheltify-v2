import { Component, effect, model, OnInit, output } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { schema } from 'ngx-editor/schema';
import { Plugin } from 'prosemirror-state'

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

    const plainTextOnlyPaste = new Plugin({
     props: {
         transformPastedHTML(html: string): string {
              const doc = new DOMParser().parseFromString(
                     html,
                    "text/html");
             return doc.body.textContent || "";
         }
     }
 });
 
 this.editor = new Editor({ plugins: [plainTextOnlyPaste] });
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

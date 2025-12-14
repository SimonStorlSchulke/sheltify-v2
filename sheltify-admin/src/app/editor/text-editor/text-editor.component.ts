import { Component, model, OnInit, output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorView } from 'prosemirror-view';
import { toggleMark } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Schema, NodeSpec, MarkSpec, Mark, Node as PMNode, DOMOutputSpec } from 'prosemirror-model';

// --- 1. Define a schema with a custom link mark ---
const nodes: { [key: string]: NodeSpec } = {
  doc: { content: "block+" },
  paragraph: {
    group: "block",
    content: "inline*",
    parseDOM: [{ tag: "p" }],
    toDOM: () => ["p", 0]
  },
  text: { group: "inline" }
};

const link: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
    class: { default: null },
    rel: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs: (dom: Node | string): Record<string, any> | null => {
        if (!(dom instanceof HTMLElement)) return null;
        return {
          href: dom.getAttribute("href"),
          class: dom.getAttribute("class"),
          rel: dom.getAttribute("rel"),
          title: dom.getAttribute("title"),
        };
      },
    },
  ],
  toDOM: (mark: Mark, inline: boolean): DOMOutputSpec => {
    return ["a", mark.attrs, 0];
  },
};

const schema = new Schema({
  nodes,
  marks: {
    link,
  },
});

@Component({
  selector: 'app-text-editor',
  imports: [
    NgxEditorModule,
    FormsModule
  ],
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  editor: Editor;

  htmlModel = model<string>('');
  html: string = "";
  htmlInput = output<string>();

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];


  constructor() {
    const plainTextOnlyPaste = new Plugin({
      props: {
        transformPastedHTML(html: string): string {
          const doc = new DOMParser().parseFromString(html, "text/html");
          return doc.body.textContent || "";
        }
      }
    });

    this.editor = new Editor({
      content: '',
      schema,
      plugins: [
        plainTextOnlyPaste,
      ],
      history: true,
      keyboardShortcuts: true,
      inputRules: true,
    });
  }

  ngOnInit() {
    this.html = this.htmlModel();
  }

  addButtonLink(event: MouseEvent) {
    event.preventDefault(); // keep selection
    const href = prompt("Enter URL for button");
    if (!href) return;

    const view: EditorView = this.editor.view;
    const markType = view.state.schema.marks['link'];
    if (!markType) return;

    toggleMark(markType, {
      href,
      class: 'BUTTON',          // <- now works
      rel: "noopener noreferrer",
    })(view.state, view.dispatch);

    view.focus();
  }

  onChange(value: string) {
    this.html = value;
    this.htmlModel.set(value);
    this.htmlInput.emit(value);
  }
}

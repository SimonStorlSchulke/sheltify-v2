import { Component, model, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorView } from 'prosemirror-view';
import { toggleMark } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Schema, NodeSpec, MarkSpec, Mark, DOMOutputSpec } from 'prosemirror-model';
import { ButtonLinkDialogComponent } from 'src/app/editor/text-editor/button-link-dialog/button-link-dialog.component';
import { ModalService } from 'src/app/services/modal.service';
import { marks as defaultMarks } from 'ngx-editor';

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

const myLink: MarkSpec = {
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
  nodes: nodes,
  marks: {
    ...defaultMarks,
    myLink: myLink,
  }
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

  constructor(private readonly modalService: ModalService) {
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

  async addButtonLink(event: MouseEvent) {
    event.preventDefault();
    const data = await this.modalService.openFinishable(ButtonLinkDialogComponent);
    if (!data || !data.url) return;

    const view: EditorView = this.editor.view;

    toggleMark(view.state.schema.marks['myLink'], {
      href: data.url,
      class: `article-button ${data.buttonTye}`,
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

import { Component } from '@angular/core';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';

@Component({
  selector: 'app-page-editor',
  imports: [
    ArticleEditorComponent
  ],
  templateUrl: './page-editor.component.html',
  styleUrl: './page-editor.component.scss',
})
export class PageEditorComponent {

}

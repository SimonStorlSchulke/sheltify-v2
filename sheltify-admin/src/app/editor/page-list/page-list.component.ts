import { Component } from '@angular/core';
import { PageEditorComponent } from 'src/app/editor/page-editor/page-editor.component';

@Component({
  selector: 'app-page-list',
  imports: [
    PageEditorComponent
  ],
  templateUrl: './page-list.component.html',
  styleUrl: './page-list.component.scss',
})
export class PageListComponent {

}

import { Component, input } from '@angular/core';
import { CmsTag } from 'src/app/cms-types/cms-types';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  tag = input.required<CmsTag>();
}

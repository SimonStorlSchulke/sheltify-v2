import { Component, input } from '@angular/core';
import { CmsTag } from 'sheltify-lib/cms-types';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  tag = input.required<CmsTag>();
}

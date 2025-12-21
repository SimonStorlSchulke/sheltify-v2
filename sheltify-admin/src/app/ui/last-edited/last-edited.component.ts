import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { CmsType } from 'sheltify-lib/cms-types';

@Component({
  selector: 'app-last-edited',
  imports: [
    DatePipe
  ],
  templateUrl: './last-edited.component.html',
  styleUrl: './last-edited.component.scss',
})
export class LastEditedComponent {
  entry = input.required<CmsType>();
}

import { Component, HostBinding, input } from '@angular/core';
import { CmsImage } from 'src/app/cms-types/cms-types';
import { CmsImageDirective } from 'src/app/ui/cms-image.directive';
import { CmsImagePipe } from 'src/app/ui/cms-image.pipe';

@Component({
  selector: 'app-media-entry',
  imports: [
    CmsImagePipe,
    CmsImageDirective
  ],
  templateUrl: './media-entry.component.html',
  styleUrl: './media-entry.component.scss'
})
export class MediaEntryComponent {
  media = input.required<CmsImage>();

  @HostBinding('class.selected')
  get _selected() {return this.selected();}

  @HostBinding('class.active')
  get _active() {return this.active()}

  selected = input<boolean>(false);

  active = input<boolean>(false);
}

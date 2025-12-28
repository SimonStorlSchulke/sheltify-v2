import { Component, computed, input } from '@angular/core';
import {
  bootstrapBoxArrowUpRight,
  bootstrapGripVertical,
  bootstrapX,
  bootstrapPlus,
  bootstrapEye,
  bootstrapCardImage,
  bootstrapGearFill,
  bootstrapPersonFill,
  bootstrapJournalBookmarkFill,
  bootstrapFileEarmarkFill,
  bootstrapHouseFill,
  bootstrapPencilFill,
} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

export type IconName =
  | 'BoxArrowUpRight'
  | 'GripVertical'
  | 'X'
  | 'Plus'
  | 'Eye'
  | 'CardImage'
  | 'GearFill'
  | 'PersonFill'
  | 'Paw'
  | 'JournalBookmarkFill'
  | 'FileEarmarkFill'
  | 'HouseFill'
  | 'PencilFill'

@Component({
  selector: 'app-bt-icon',
  imports: [
    NgIcon
  ],
  templateUrl: './bt-icon.component.html',
  styleUrl: './bt-icon.component.scss',
  providers: [provideIcons({
      bootstrapBoxArrowUpRight,
      bootstrapGripVertical,
      bootstrapX,
      bootstrapPlus,
      bootstrapEye,
      bootstrapCardImage,
      bootstrapGearFill,
      bootstrapPersonFill,
      bootstrapJournalBookmarkFill,
      bootstrapFileEarmarkFill,
      bootstrapHouseFill,
      bootstrapPencilFill,
    }
  )]
})
export class BtIconComponent {
  public name = input.required<IconName>()
  public size = input<'s' | 'ms' | 'ml' | 'l'>();

  public customIconPath = computed(() => {
    return new Map<IconName, string>([
      ['Paw', '/assets/icons/paw-icon.svg']
    ]).get(this.name())
  })

  public iconSize = computed(() => {
    return new Map([
      ['s', 16],
      ['ms', 20],
      [undefined, 24],
      ['ml', 28],
      ['l', 32],
    ]).get(this.size())
  })
}

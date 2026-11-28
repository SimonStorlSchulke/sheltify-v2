import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
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
  bootstrapHammer,
  bootstrapBoxArrowRight,
  bootstrapGenderMale,
  bootstrapGenderFemale,
  bootstrapHeartFill,
  bootstrapInfoCircle,
  bootstrapEnvelopeFill,
  bootstrapPaintBucket,
  bootstrapChevronDown,
  bootstrapChevronLeft,
  bootstrapChevronRight,
  bootstrapTable,
  bootstrapTrash,
  bootstrapExclamation,
  bootstrapTypeH1,
  bootstrapTextParagraph,
  bootstrapCodeSlash,
  bootstrapDashLg,
  bootstrapLayoutThreeColumns,
  bootstrapImages,
  bootstrapCameraVideo,
  bootstrapWindowFullscreen,
  bootstrapFileEarmarkArrowDown,
  bootstrapHouseHeart,
  bootstrapChatQuote,
  bootstrapMegaphone,
  bootstrapUiChecks,
  bootstrapNewspaper,
  bootstrapPersonBadge,
  bootstrapStars,
  bootstrapGrid,
  bootstrapScissors,
  bootstrapCopy,
} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

export type IconName =
  | 'BoxArrowUpRight'
  | 'GripVertical'
  | 'X'
  | 'Plus'
  | 'Minus'
  | 'Eye'
  | 'CardImage'
  | 'GearFill'
  | 'PersonFill'
  | 'Paw'
  | 'JournalBookmarkFill'
  | 'FileEarmarkFill'
  | 'HouseFill'
  | 'PencilFill'
  | 'Hammer'
  | 'BoxArrowRight'
  | 'GenderMale'
  | 'GenderFemale'
  | 'HeartFill'
  | 'InfoCircle'
  | 'EnvelopeFill'
  | 'PaintBucket'
  | 'ChevronDown'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'Table'
  | 'Trash'
  | 'Exclamation'
  | 'TypeH1'
  | 'TextParagraph'
  | 'CodeSlash'
  | 'DashLg'
  | 'LayoutThreeColumns'
  | 'Images'
  | 'CameraVideo'
  | 'WindowFullscreen'
  | 'FileEarmarkArrowDown'
  | 'HouseHeart'
  | 'ChatQuote'
  | 'Megaphone'
  | 'UiChecks'
  | 'Newspaper'
  | 'PersonBadge'
  | 'Stars'
  | 'Grid'
  | 'Scissors'
  | 'Copy'

@Component({
  selector: 'app-bt-icon',
  imports: [
    NgIcon
  ],
  templateUrl: './bt-icon.component.html',
  styleUrl: './bt-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
      bootstrapHammer,
      bootstrapBoxArrowRight,
      bootstrapGenderMale,
      bootstrapGenderFemale,
      bootstrapHeartFill,
      bootstrapInfoCircle,
      bootstrapEnvelopeFill,
      bootstrapPaintBucket,
      bootstrapChevronDown,
      bootstrapChevronLeft,
      bootstrapChevronRight,
      bootstrapTable,
      bootstrapTrash,
      bootstrapExclamation,
      bootstrapTypeH1,
      bootstrapTextParagraph,
      bootstrapCodeSlash,
      bootstrapDashLg,
      bootstrapLayoutThreeColumns,
      bootstrapImages,
      bootstrapCameraVideo,
      bootstrapWindowFullscreen,
      bootstrapFileEarmarkArrowDown,
      bootstrapHouseHeart,
      bootstrapChatQuote,
      bootstrapMegaphone,
      bootstrapUiChecks,
      bootstrapNewspaper,
      bootstrapPersonBadge,
      bootstrapStars,
      bootstrapGrid,
      bootstrapScissors,
      bootstrapCopy,
    }
  )]
})
export class BtIconComponent {
  name = input.required<IconName>()
  size = input<'s' | 'ms' | 'ml' | 'l'>();

  customIconPath = computed(() => {
    return new Map<IconName, string>([
      ['Paw', '/assets/icons/paw-icon.svg']
    ]).get(this.name())
  })

  iconSize = computed(() => {
    return new Map([
      ['s', 16],
      ['ms', 20],
      [undefined, 24],
      ['ml', 28],
      ['l', 32],
    ]).get(this.size())
  })
}

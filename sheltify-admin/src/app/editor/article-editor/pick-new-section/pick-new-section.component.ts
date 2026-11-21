import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { SectionSpecial, SectionType } from 'sheltify-lib/article-types';
import { SpecialArticleSections } from 'sheltify-lib/dist/cms-types';
import { newSpecialSection } from '@app/editor/article-editor/article-section.factory';
import { sectionLabels } from '@app/services/article-renderer';
import { FinishableDialog } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { BtIconComponent, IconName } from '@app/ui/bt-icon/bt-icon.component';

interface SectionGroup {
  label: string;
  types: SectionType[];
}

@Component({
  selector: 'app-pick-new-section',
  imports: [BtIconComponent],
  templateUrl: './pick-new-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pick-new-section.component.scss'
})
export class PickNewSectionComponent extends FinishableDialog<SectionType | SectionSpecial> {
  readonly sectionGroups: SectionGroup[] = [
    { label: 'Text & Layout', types: ['title', 'text', 'columns', 'separator-x', 'html'] },
    { label: 'Medien', types: ['image', 'video', 'hero', 'file'] },
    { label: 'Tiere', types: ['animal-list', 'home-found', 'home-found-feedback', 'animal-updates'] },
    { label: 'Sonstiges', types: ['form', 'blogs', 'team-member'] },
  ];

  readonly sectionIcons: Record<Exclude<SectionType, 'special'>, IconName> = {
    'title': 'TypeH1',
    'text': 'TextParagraph',
    'columns': 'LayoutThreeColumns',
    'separator-x': 'DashLg',
    'html': 'CodeSlash',
    'image': 'Images',
    'video': 'CameraVideo',
    'hero': 'Images',
    'file': 'FileEarmarkArrowDown',
    'animal-list': 'Grid',
    'home-found': 'HouseHeart',
    'home-found-feedback': 'ChatQuote',
    'animal-updates': 'Megaphone',
    'form': 'UiChecks',
    'blogs': 'Newspaper',
    'team-member': 'PersonBadge',
  };

  sectionLabels = sectionLabels;

  /** Set via ModalService inputs, e.g. to hide types that are not supported inside columns. */
  excludedTypes: SectionType[] = [];

  visibleGroups(): SectionGroup[] {
    return this.sectionGroups
      .map(group => ({ ...group, types: group.types.filter(type => !this.excludedTypes.includes(type)) }))
      .filter(group => group.types.length > 0);
  }

  private tenantConfigurationService = inject(TenantConfigurationService);
  tenantsSpecialSections = signal<SpecialArticleSections | undefined>(undefined);
  specialSectionNames = computed(() => Object.keys(this.tenantsSpecialSections() ?? {}));

  constructor() {
    super();
    this.tenantConfigurationService.providedSpecialSections().then(v => this.tenantsSpecialSections.set(v));
  }

  tenantName = computed(() => this.tenantConfigurationService.config()?.Name)

  iconFor(sectionType: SectionType): IconName {
    return sectionType === 'special' ? 'Stars' : this.sectionIcons[sectionType];
  }

  async pickSpecialSection(sectionName: string) {
    const section = newSpecialSection(sectionName, this.tenantsSpecialSections()!)
    this.finishWith(section)
  }
}

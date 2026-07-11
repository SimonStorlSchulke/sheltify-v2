import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { SectionSpecial, SectionType, SectionTypes } from 'sheltify-lib/article-types';
import { SpecialArticleSections } from 'sheltify-lib/dist/cms-types';
import { newSpecialSection } from '@app/editor/article-editor/article-section.factory';
import { sectionLabels } from '@app/services/article-renderer';
import { FinishableDialog } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';

@Component({
  selector: 'app-pick-new-section',
  imports: [],
  templateUrl: './pick-new-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pick-new-section.component.scss'
})
export class PickNewSectionComponent extends FinishableDialog<SectionType | SectionSpecial> {
  SectionTypes = SectionTypes;
  sectionLabels = sectionLabels;

  private tenantConfigurationService = inject(TenantConfigurationService);
  tenantsSpecialSections = signal<SpecialArticleSections | undefined>(undefined);

  constructor() {
    super();
    this.tenantConfigurationService.providedSpecialSections().then(v => this.tenantsSpecialSections.set(v));
  }

  tenantName = computed(() => this.tenantConfigurationService.config()?.Name)

  async pickSpecialSection(sectionName: string) {

    const section = newSpecialSection(sectionName, this.tenantsSpecialSections()!)
    this.finishWith(section)
  }

  readonly Object = Object;
}

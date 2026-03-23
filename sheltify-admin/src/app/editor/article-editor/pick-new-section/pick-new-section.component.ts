import { Component, computed, inject, signal } from '@angular/core';
import { SectionSpecial, SectionType, SectionTypes } from 'sheltify-lib/article-types';
import { SpecialArticleSections } from 'sheltify-lib/dist/cms-types';
import { newSpecialSection } from 'src/app/editor/article-editor/article-section.factory';
import { sectionLabels } from 'src/app/services/article-renderer';
import { FinishableDialog } from 'src/app/services/modal.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';

@Component({
  selector: 'app-pick-new-section',
  imports: [],
  templateUrl: './pick-new-section.component.html',
  styleUrl: './pick-new-section.component.scss'
})
export class PickNewSectionComponent extends FinishableDialog<SectionType | SectionSpecial> {
  public SectionTypes = SectionTypes;
  public sectionLabels = sectionLabels;

  private tenantConfigurationService = inject(TenantConfigurationService);
  public tenantsSpecialSections = signal<SpecialArticleSections | undefined>(undefined);

  constructor() {
    super();
    this.tenantConfigurationService.providedSpecialSections().then(v => this.tenantsSpecialSections.set(v));
  }

  public tenantName = computed(() => this.tenantConfigurationService.config()?.Name)

  public async pickSpecialSection(sectionName: string) {

    const section = newSpecialSection(sectionName, this.tenantsSpecialSections()!)
    this.finishWith(section)
  }

  protected readonly Object = Object;
}

import { Component, computed, inject } from '@angular/core';
import { SectionSpecial, SectionType, SectionTypes } from 'sheltify-lib/article-types';
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

  public tenantsSpecialSections = computed(() => {
    const sections = this.tenantConfigurationService.config()?.SpecialArticleSections;
    if(sections) {
      console.log("Section Types ", sections);
      return Object.entries(sections);
    }
      console.log("c ", this.tenantConfigurationService.config());
    return undefined;
  })

  public tenantName = computed(() => this.tenantConfigurationService.config()?.Name)

  public pickSpecialSection(index: number) {
    const sectionName = this.tenantsSpecialSections()![index][0];
    const section = newSpecialSection(sectionName, this.tenantConfigurationService.config()!.SpecialArticleSections!)
    this.finishWith(section)
  }
}

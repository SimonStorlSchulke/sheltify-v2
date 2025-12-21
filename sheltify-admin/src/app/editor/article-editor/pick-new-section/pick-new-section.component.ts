import { Component } from '@angular/core';
import { SectionType, SectionTypes } from 'sheltify-lib/article-types';
import { sectionLabels } from 'src/app/services/article-renderer';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-pick-new-section',
  imports: [],
  templateUrl: './pick-new-section.component.html',
  styleUrl: './pick-new-section.component.scss'
})
export class PickNewSectionComponent extends FinishableDialog<SectionType>{
  public SectionTypes = SectionTypes;
  public sectionLabels = sectionLabels;
}

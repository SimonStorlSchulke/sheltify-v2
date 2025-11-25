import { Component } from '@angular/core';
import { SectionType, SectionTypes } from 'src/app/cms-types/article-types';
import { FinishableDialog } from 'src/app/services/modal.service';

@Component({
  selector: 'app-pick-new-section',
  imports: [],
  templateUrl: './pick-new-section.component.html',
  styleUrl: './pick-new-section.component.scss'
})
export class PickNewSectionComponent extends FinishableDialog<SectionType>{
  public SectionTypes = SectionTypes;
}

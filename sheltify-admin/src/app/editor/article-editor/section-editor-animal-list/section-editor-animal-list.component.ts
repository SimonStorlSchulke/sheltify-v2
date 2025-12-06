import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, firstValueFrom, Subject, Subscription } from 'rxjs';
import { SectionAnimalList } from 'src/app/cms-types/article-types';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { RangeInputComponent } from 'src/app/forms/range-input/range-input.component';
import { SelectInputComponent } from 'src/app/forms/select-input/select-input.component';
import { CmsRequestService } from 'src/app/services/cms-request.service';

@Component({
  selector: 'app-section-editor-animal-list',
  imports: [
    RangeInputComponent,
    FormsModule,
    SelectInputComponent,
    NumberInputComponent
  ],
  templateUrl: './section-editor-animal-list.component.html',
  styleUrl: './section-editor-animal-list.component.scss',
})
export class SectionEditorAnimalListComponent implements OnInit, OnDestroy {
  section = input.required<SectionAnimalList>();
  triggerRerender = output<void>();

  onInput = new Subject<void>();

  updateSubscription?: Subscription;

  constructor(
    private cmsRequestService: CmsRequestService,
  ) {
  }

  public ngOnInit() {
    this.updateSubscription = this.onInput.pipe(debounceTime(1000)).subscribe(() => this.updateAnimals());
    this.updateAnimals();
  }

  async updateAnimals() {
    this.section().TempFoundAnimals = await firstValueFrom(this.cmsRequestService.getFilteredAnimals(this.section().Content));
    this.triggerRerender.emit();
  }

  public ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
  }
}

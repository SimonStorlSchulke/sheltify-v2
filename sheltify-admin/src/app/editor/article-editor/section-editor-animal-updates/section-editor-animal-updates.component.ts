import { Component, input, OnDestroy, OnInit, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, firstValueFrom, Subject, Subscription } from 'rxjs';
import { SectionAnimalUpdates } from 'sheltify-lib/article-types';
import { animalsByArticleId } from 'sheltify-lib/dist/animal-util';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { SelectInputComponent } from '@app/forms/select-input/select-input.component';
import { CmsRequestService } from '@app/services/cms-request.service';

@Component({
  selector: 'app-section-editor-animal-updates',
  imports: [
    FormsModule,
    SelectInputComponent,
    NumberInputComponent
  ],
  templateUrl: './section-editor-animal-updates.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-editor-animal-updates.component.scss',
})
export class SectionEditorAnimalUpdatesComponent implements OnInit, OnDestroy {
  private cmsRequestService = inject(CmsRequestService);

  section = input.required<SectionAnimalUpdates>();
  triggerRerender = output<void>();

  onInput = new Subject<void>();

  updateSubscription?: Subscription;

  ngOnInit() {
    this.updateSubscription = this.onInput.pipe(debounceTime(1000)).subscribe(() => this.updateAnimals());
    this.updateAnimals();
  }

  async updateAnimals() {
    this.section().TempAnimalsByArticle = animalsByArticleId(await firstValueFrom(this.cmsRequestService.getAnimalUpdates(this.section().Content.days)));
    this.triggerRerender.emit();
  }

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
  }
}

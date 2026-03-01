import { Component, input, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, lastValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from 'src/app/cms-types/cms-type.factory';
import { CmsAnimal, SqlNullTimeNow } from 'sheltify-lib/cms-types';
import { SaveAnimalComponent } from 'src/app/editor/animal-editor/save-animal/save-animal.component';
import { ArticleEditorComponent } from 'src/app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from 'src/app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from 'src/app/forms/date-picker/date-picker.component';
import { ImagePickerSingleComponent } from 'src/app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from 'src/app/forms/number-input/number-input.component';
import { RadioButtonsInputComponent } from 'src/app/forms/radio-buttons-input/radio-buttons-input.component';
import { SelectInputComponent } from 'src/app/forms/select-input/select-input.component';
import { AlertService } from 'src/app/services/alert.service';
import { AnimalService } from 'src/app/services/animal.service';
import { ModalService } from 'src/app/services/modal.service';
import { TenantConfigurationService } from 'src/app/services/tenant-configuration.service';
import { AnimalPickerDialogComponent } from 'src/app/ui/animal-picker-dialog/animal-picker-dialog.component';
import { LastEditedComponent } from 'src/app/ui/last-edited/last-edited.component';
import { TextInputComponent } from '../../forms/text-input/text-input.component';
import { CmsRequestService } from '../../services/cms-request.service';
import { TextInputModalComponent } from 'src/app/forms/text-input-modal/text-input-modal.component';

@Component({
  selector: 'app-animal-editor',
  imports: [
    TextInputComponent,
    FormsModule,
    CheckboxInputComponent,
    ImagePickerSingleComponent,
    ArticleEditorComponent,
    DatePickerComponent,
    RadioButtonsInputComponent,
    NumberInputComponent,
    SelectInputComponent,
    LastEditedComponent,
  ],
  templateUrl: './animal-editor.component.html',
  styleUrl: './animal-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalEditorComponent {

  private cmsRequestService = inject(CmsRequestService);

  public animal = input<CmsAnimal | null>(null);
  public animals = input.required<CmsAnimal[] | null>();
  public saved = output<CmsAnimal | null>();
  public deleted = output();

  public saveArticle$ = new Subject<{updateNote: string, pushUpdate: boolean}>();

  public animalKinds: string[] = [];

  constructor(
    public tenantConfigurationService: TenantConfigurationService,
    private modalService: ModalService,
    private animalService: AnimalService,
    private alertService: AlertService,
  ) {
  }

  async ngOnInit() {
    this.animalKinds = (await this.tenantConfigurationService.animalKinds());
  }

  async saveFromUI() {
    const saveOptions = await this.modalService.openFinishable(SaveAnimalComponent);
    if (!saveOptions) return;
    this.save(saveOptions.pushUpdate, saveOptions.updateNote);
  }

  async save(pushUpdate: boolean = false, updateNote: string = '') {
    const savedAnimal = await this.animalService.save(this.animal()!);

    if (savedAnimal) {
      this.saved.emit(savedAnimal!);
      this.saveArticle$.next({updateNote, pushUpdate});
    }
  }

  async togglePublished() {
    const savedAnimal = await this.animalService.togglePublished(this.animal()!);

    if (savedAnimal) {
      this.saved.emit(savedAnimal!);
      this.saveArticle$.next({pushUpdate: false, updateNote: ''});
    }
  }

  protected async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.animal()!.ArticleID = savedArticle.ID;
    this.save();
  }

  protected async assignExistingArticle() {
    const selectedAnimal = await this.modalService.openFinishable(AnimalPickerDialogComponent, {
      animals: this.animals()!
    });

    if (selectedAnimal) {
      this.animal()!.ArticleID = selectedAnimal.ArticleID;
      this.save();
    }
  }

  protected async delete() {
    if (!await this.alertService.confirmDelete()) return;
    await lastValueFrom(this.cmsRequestService.deleteAnimals([this.animal()!.ID]));
    this.deleted.emit();
  }
}

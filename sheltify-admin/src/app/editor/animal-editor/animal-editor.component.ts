import { Component, input, inject, output, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, lastValueFrom, Subject } from 'rxjs';
import { CmsArticle } from 'sheltify-lib/article-types';
import { createEmptyArticle } from '@app/cms-types/cms-type.factory';
import { CmsAnimal } from 'sheltify-lib/cms-types';
import { SaveAnimalComponent } from '@app/editor/animal-editor/save-animal/save-animal.component';
import { ArticleEditorComponent } from '@app/editor/article-editor/article-editor.component';
import { CheckboxInputComponent } from '@app/forms/checkbox-input/checkbox-input.component';
import { DatePickerComponent } from '@app/forms/date-picker/date-picker.component';
import { ImagePickerSingleComponent } from '@app/forms/image-picker-single/image-picker-single.component';
import { NumberInputComponent } from '@app/forms/number-input/number-input.component';
import { RadioButtonsInputComponent } from '@app/forms/radio-buttons-input/radio-buttons-input.component';
import { SelectInputComponent } from '@app/forms/select-input/select-input.component';
import { AlertService } from '@app/services/alert.service';
import { AnimalService } from '@app/services/animal.service';
import { AskSaveService } from '@app/services/ask-save.service';
import { ModalService } from '@app/services/modal.service';
import { TenantConfigurationService } from '@app/services/tenant-configuration.service';
import { AnimalPickerDialogComponent } from '@app/ui/animal-picker-dialog/animal-picker-dialog.component';
import { LastEditedComponent } from '@app/ui/last-edited/last-edited.component';
import { ManageEntryButtonsComponent } from '@app/ui/manage-entry-buttons/manage-entry-buttons.component';
import { TextInputComponent } from '../../forms/text-input/text-input.component';
import { CmsRequestService } from '../../services/cms-request.service';

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
    ManageEntryButtonsComponent,
  ],
  templateUrl: './animal-editor.component.html',
  styleUrl: './animal-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalEditorComponent implements OnInit {
  tenantConfigurationService = inject(TenantConfigurationService);
  cdRef = inject(ChangeDetectorRef);
  private cmsRequestService = inject(CmsRequestService);
  private modalService = inject(ModalService);
  private animalService = inject(AnimalService);
  private alertService = inject(AlertService);
  private askSaveService = inject(AskSaveService);



  animal = input<CmsAnimal | null>(null);
  animals = input.required<CmsAnimal[] | null>();
  saved = output<CmsAnimal | null>();
  deleted = output();

  saveArticle$ = new Subject<{ updateNote: string, pushUpdate: boolean }>();
  animalStati: string[] = [];
  animalKinds: string[] = [];


  constructor() {
    this.askSaveService.triggerSave$.pipe(takeUntilDestroyed()).subscribe(() => this.saveFromUI());
  }

  async ngOnInit() {
    this.animalKinds = (await this.tenantConfigurationService.animalKinds());
    this.animalStati = (await this.tenantConfigurationService.animalStati());
    console.log("animalStati", this.animalStati)
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

  async createArticle() {
    const article: CmsArticle = createEmptyArticle();
    const savedArticle = await firstValueFrom(this.cmsRequestService.saveArticle(article));
    this.animal()!.ArticleID = savedArticle.ID;
    this.save();
  }

  async assignExistingArticle() {
    const selectableAnimals = this.animals()?.filter(animal => (
      animal.ID !== this.animal()?.ID) && this.animalService.isPublished(animal)
    );
    const selectedAnimal = await this.modalService.openFinishable(AnimalPickerDialogComponent, {
      animals: selectableAnimals,
    });

    if (selectedAnimal) {
      this.animal()!.ArticleID = selectedAnimal.ArticleID;
      this.save();
    }
  }

  async delete() {
    if (!await this.alertService.confirmDelete()) return;
    await lastValueFrom(this.cmsRequestService.deleteAnimals([this.animal()!.ID]));
    this.deleted.emit();
  }

  setStatus(status: string, active: boolean) {
    this.askSaveService.markDirty();
    const animal = this.animal()!;
    let currentStati = animal.Status?.split(',') ?? []
    currentStati = currentStati.filter(status => this.animalStati.includes(status));
    const stati = new Set(currentStati);
    active ? stati.add(status) : stati.delete(status);
    animal.Status = [...stati].join(',');
    console.log(animal.Status)
  }
}

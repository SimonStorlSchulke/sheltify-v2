import { Component, inject, input, output } from '@angular/core';
import { SqlNullTime } from 'sheltify-lib/dist/cms-types';
import { AskSaveService } from 'src/app/services/ask-save.service';

@Component({
  selector: 'app-manage-entry-buttons',
  imports: [],
  templateUrl: './manage-entry-buttons.component.html',
  styleUrl: './manage-entry-buttons.component.scss',
})
export class ManageEntryButtonsComponent {
  entry = input<{PublishedAt?: SqlNullTime}>();
  togglePublished = output();
  save = output();
  delete = output();
  private askService = inject(AskSaveService);

  dirty = this.askService.dirty;

  triggerSave() {
    this.save.emit();
    this.askService.clean();
  }
}

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
  public entry = input<{PublishedAt?: SqlNullTime}>();
  public togglePublished = output();
  public save = output();
  public delete = output();
  private askService = inject(AskSaveService);

  public dirty = this.askService.dirty;

  public triggerSave() {
    this.save.emit();
    this.askService.clean();
  }
}

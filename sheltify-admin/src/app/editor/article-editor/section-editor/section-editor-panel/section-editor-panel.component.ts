import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BtIconComponent } from '@app/ui/bt-icon/bt-icon.component';

/** Frame of the section editor dialog: titlebar with the section actions, the editor goes into the body. */
@Component({
  selector: 'app-section-editor-panel',
  imports: [BtIconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './section-editor-panel.component.html',
  styleUrl: './section-editor-panel.component.scss',
})
export class SectionEditorPanelComponent {
  label = input.required<string>();
  /** Show "Kopieren" and "Ausschneiden". */
  clipboard = input(false);

  deletedSection = output();
  done = output();
  move = output();
  copy = output();
  cut = output();
}

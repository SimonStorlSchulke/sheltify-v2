import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimalService } from '@app/services/animal.service';
import { computeAttentionItems } from '../dashboard-stats';

/** How many animals per group are shown before "mehr anzeigen". */
const COLLAPSED_AMOUNT = 5;

@Component({
  selector: 'app-attention-list',
  imports: [RouterLink],
  templateUrl: './attention-list.component.html',
  styleUrl: './attention-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionListComponent {
  private animalService = inject(AnimalService);

  readonly collapsedAmount = COLLAPSED_AMOUNT;

  items = computed(() => computeAttentionItems(this.animalService.animals()));
  expanded = signal(new Set<string>());

  toggle(key: string) {
    this.expanded.update(set => {
      const next = new Set(set);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }
}

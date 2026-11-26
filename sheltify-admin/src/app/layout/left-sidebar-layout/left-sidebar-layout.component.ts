import { Component, signal, ChangeDetectionStrategy, inject, ElementRef, Injector, afterNextRender } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-left-sidebar-layout',
  imports: [],
  templateUrl: './left-sidebar-layout.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './left-sidebar-layout.component.scss',
})
export class LeftSidebarLayoutComponent {
  mobileOpen = signal(false);

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private injector = inject(Injector);

  constructor() {
    // switching the entry (page, blog, animal, ...) is a navigation: start the new one at the top
    inject(Router).events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe(() => afterNextRender(() => this.scrollContentToTop(), {injector: this.injector}));
  }

  private scrollContentToTop() {
    this.elementRef.nativeElement
      .querySelectorAll<HTMLElement>('.content, .content .editor-layout')
      .forEach(element => element.scrollTop = 0);
  }
}

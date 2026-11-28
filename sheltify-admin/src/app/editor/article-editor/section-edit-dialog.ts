import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DestroyRef, inject, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { Section } from 'sheltify-lib/article-types';

/**
 * Edits one section at a time in a dialog. Changes are applied live to the section,
 * "Fertig", Esc and backdrop click close the dialog.
 *
 * Must be created in an injection context (e.g. as a component field).
 */
export class SectionEditDialog {
  readonly edited = signal<{ section: Section } | undefined>(undefined);

  private readonly dialog = inject(Dialog);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private dialogRef?: DialogRef<unknown, unknown>;

  constructor(
    private readonly options: {
      template: () => TemplateRef<unknown>;
      /** The list (article rows or a column) that currently contains `section`. */
      findList: (section: Section) => Section[] | undefined;
      /** Called after editing ended, e.g. to re-render the preview. */
      afterClose?: (section: Section) => void;
    },
  ) {
    inject(DestroyRef).onDestroy(() => this.dialogRef?.close());
  }

  open(section: Section) {
    if (this.edited()?.section === section) return;
    this.edited.set({ section });
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(this.options.template(), {
      panelClass: 'modal-mobile-fullscreen',
      viewContainerRef: this.viewContainerRef,
      autoFocus: 'dialog',
      ariaLabel: 'Sektion bearbeiten',
    });
    this.dialogRef.closed.subscribe(() => {
      this.dialogRef = undefined;
      this.close();
    });
  }

  /** Ends editing and keeps the changes. */
  close() {
    const edited = this.edited();
    const dialogRef = this.dialogRef;
    // forget the ref right away, so open() right after close() opens a new dialog
    this.dialogRef = undefined;
    this.edited.set(undefined);
    dialogRef?.close();
    if (edited) this.options.afterClose?.(edited.section);
  }

  /** Ends editing and removes the edited section. Returns it, e.g. for "Ausschneiden". */
  remove(): Section | undefined {
    const edited = this.edited();
    if (!edited) return undefined;
    const list = this.options.findList(edited.section);
    if (list) list.splice(list.indexOf(edited.section), 1);
    this.close();
    return edited.section;
  }
}

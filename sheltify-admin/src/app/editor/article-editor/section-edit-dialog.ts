import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DestroyRef, inject, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { Section } from 'sheltify-lib/article-types';

export interface EditedSection {
  section: Section;
  /** State before editing started, restored on "Verwerfen". */
  snapshot: Section;
  /** Section was just added - "Verwerfen" removes it again. */
  isNew: boolean;
}

/**
 * Edits one section at a time in a dialog. Changes are applied live to the section,
 * "Verwerfen" restores the state from before the dialog was opened.
 * Esc and backdrop click close the dialog and keep the changes.
 *
 * Must be created in an injection context (e.g. as a component field).
 */
export class SectionEditDialog {
  readonly edited = signal<EditedSection | undefined>(undefined);

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

  open(section: Section, isNew = false) {
    if (this.edited()?.section === section) return;
    this.edited.set({ section, snapshot: structuredClone(section), isNew });
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

  /** Ends editing and restores the state from before (removes the section if it was just added). */
  discard() {
    const edited = this.edited();
    if (!edited) return;
    const list = this.options.findList(edited.section);
    if (list) {
      const index = list.indexOf(edited.section);
      if (edited.isNew) {
        list.splice(index, 1);
      } else {
        list[index] = edited.snapshot;
      }
    }
    this.close();
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

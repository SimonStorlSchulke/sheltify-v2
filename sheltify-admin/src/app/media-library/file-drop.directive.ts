// file-drop.directive.ts
import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {
  @Output() filesDropped = new EventEmitter<FileList>();
  @Output() filesHovered = new EventEmitter<boolean>();

  @HostBinding('class.fileover') fileOver: boolean = false;

  // Prevent default behavior (Prevent file from being opened)
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
    this.filesHovered.emit(true);
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    this.filesHovered.emit(false);
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.filesDropped.emit(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
    this.filesHovered.emit(false);
  }
}

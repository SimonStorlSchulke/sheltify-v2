import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  public async uploadImages(files: FileList): Promise<void> {
    return;
  }
}

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService } from '@app/layout/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  loaderSv = inject(LoaderService);
}

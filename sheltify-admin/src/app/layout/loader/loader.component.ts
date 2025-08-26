import { Component, inject } from '@angular/core';
import { LoaderService } from 'src/app/layout/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  loaderSv = inject(LoaderService);
}

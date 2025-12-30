import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { CmsAnimal } from 'sheltify-lib/dist/cms-types';
import { AnimalService } from 'src/app/services/animal.service';

@Component({
  selector: 'app-featured-animals',
  imports: [FormsModule, NgOptionComponent, NgSelectComponent],
  templateUrl: './featured-animals.component.html',
  styleUrl: './featured-animals.component.scss',
})
export class FeaturedAnimalsComponent {
  public selectedAnimals = model<CmsAnimal[]>([]);

  constructor(
    public animalService: AnimalService,
  ) {
  }
}

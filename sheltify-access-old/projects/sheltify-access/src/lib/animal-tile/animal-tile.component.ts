import { Component, Input, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalService } from '../animal.service';
import { Animal } from '../../types/types';

@Component({
  selector: 'app-animal-tile',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './animal-tile.component.html',
  styleUrl: './animal-tile.component.scss'
})
export class AnimalTileComponent {

  animalSv = inject(AnimalService);
  @Input({required: true}) animal!: Animal;
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipeListComponent } from "./recipe-list/recipe-list.component";

@Component({
  selector: 'app-recipes',
  imports: [RecipeListComponent, RouterOutlet],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {

}

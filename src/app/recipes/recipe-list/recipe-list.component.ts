import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { RecipeItemComponent } from "./recipe-item/recipe-item.component";

@Component({
  selector: 'app-recipe-list',
  imports: [FormsModule, RecipeItemComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {

  private recipeService = inject(RecipeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  recipes = () => this.recipeService.recipesChanged();

  ngOnInit() {
    this.recipeService.loadedRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }


}

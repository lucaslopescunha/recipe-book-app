import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DropdownDirective } from "../../shared/dropdown.directive";
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  imports: [DropdownDirective],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit {
  recipe = signal<Recipe>({} as Recipe);
  id!: number;
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  
  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          
          this.id = +params['id'];
          console.log("this is id: ", params['id']);
          let _recipe = this.recipeService.getRecipe(this.id);
          console.log("that's the recipe", _recipe);
          if (_recipe)
            this.recipe.set(_recipe);
        }
      );
  }

  onAddToShoppingList() {
    const r = this.recipe();
    if (!r) return;
    this.recipeService.addIngredientsToShoppingList(r.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    const subscription = this.recipeService.deleteRecipe(this.id, this.recipe().id)
      .subscribe({
        next: (response) => console.log(response)
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    this.router.navigate(['/recipes']);
  }


}


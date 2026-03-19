import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  
  recipesService = inject(RecipeService);
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<Recipe[] | RedirectCommand> {
    const recipes = this.recipesService.recipesChanged();
    if(recipes.length === 0) {
      console.log("carrega denovo")
      return this.recipesService.loadedRecipes();
    } else {
      console.log("maintain")
      return recipes;
    }
    
  }
}

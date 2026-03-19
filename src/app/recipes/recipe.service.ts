import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipes = signal<Recipe[]>([]);
  recipesChanged = this.recipes.asReadonly();
  private destroyRef = inject(DestroyRef);

  private slService = inject(ShoppingListService);

  private http = inject(HttpClient);

  loadedRecipes() {
    const subscription = this.http.get<Recipe[]>("http://localhost:8080/recipes")
      .subscribe({
        next: (response) => {
          console.log("response ", response);
          this.recipes.set(response)
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  saveRecipes(recipe: Recipe) {
    
    const subscription = this.http.post<{ name: string }>("http://localhost:8080/recipes", recipe)
      .subscribe({
        next: (response) => console.log(response)
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  updateRecipes(recipe: Recipe) {
    
    const subscription = this.http.put<{ name: string }>("http://localhost:8080/recipes/" + recipe.id, recipe)
      .subscribe({
        next: (response) => console.log(response)
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getRecipe(index: number) {
    const item = this.recipes().at(index);
    return item ? { ...item } : undefined;
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    console.log("New ", recipe);
    this.recipes.update((prevRecipes) => [...prevRecipes, recipe]);
    this.saveRecipes(recipe);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    console.log("Updated ", newRecipe);
    this.recipes.update((currentRecipes) => {
      if (index < 0 && index >= currentRecipes.length) {
        return currentRecipes;
      }
      const updatedRecipes = [...currentRecipes];
      updatedRecipes[index] = newRecipe;
      this.updateRecipes(newRecipe);
      return updatedRecipes;
    })
  }

  deleteRecipe(index: number, id: number) {
    console.log("delete recipe", id)
    this.recipes.update((currentRecipes) => {
      if (index < 0 && index >= currentRecipes.length) {
        return currentRecipes;
      }
      return currentRecipes.filter((_, _index) => _index !== index);
    });
    console.log("Delete Recipe");
    return this.http.delete<{ name: string }>("http://localhost:8080/recipes/" + id);

  }

  deleteIngredient(id: number) {
    console.log("Delete Ingredient");
    return this.http.delete<{ name: string }>("http://localhost:8080/recipes/ingredient/" + id);

  }
}

import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  /*private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];
  */
  // editing index signal (null when not editing)
  private _editing = signal<number | null>(null);
  readonly editing = this._editing.asReadonly();


  private ingredients = signal<Ingredient[]>([
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ]);
  listIngredients = this.ingredients.asReadonly();


  // editing control
  startEditing(index: number) {
    this._editing.set(index);
  }

  stopEditing() {
    this._editing.set(null);
  }

  getIngredient(index: number) {
    const item = this.ingredients().at(index);
    return item ? { ...item } : undefined;
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.update((prevIngredient) => [ingredient, ...prevIngredient]);
    console.log(this.ingredients());
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    this.ingredients.update((prevIngredient) => {
      const merged = [...prevIngredient];
      for (const ing of ingredients) {
        const idx = merged.findIndex(x => x.name === ing.name);
        if (idx >= 0) {
          merged[idx] = new Ingredient(merged[idx].name, merged[idx].amount + ing.amount);
        } else {
          merged.push(new Ingredient(ing.name, ing.amount));
        }
      }
      return merged;
    });

  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients.update(currentIngredients => {
      if (index < 0 || index >= currentIngredients.length) {
        return currentIngredients;
      }
      const updatedIngredients = [...currentIngredients];
      updatedIngredients[index] = newIngredient;
      return updatedIngredients;
    })
  }

  deleteIngredient(index: number) {
    this.ingredients.update(currentIngredients => {
      if (index < 0 || index >= currentIngredients.length) {
        return currentIngredients;
      }
      return currentIngredients.filter((_, i) => i !== index);
    });
  }
}

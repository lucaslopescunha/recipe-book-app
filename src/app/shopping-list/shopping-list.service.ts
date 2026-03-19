import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
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

  private destroyRef = inject(DestroyRef);

  private ingredients = signal<Ingredient[]>([
    //    new Ingredient('Apples', 5),
    //    new Ingredient('Tomatoes', 10),
  ]);
  listIngredients = this.ingredients.asReadonly();

  private http = inject(HttpClient);

  listIngredientsShoppingList() {

    return this.http.get<Ingredient[]>('http://localhost:8080/recipes/ingredients');

  }

  loadListIngredients() {
    const subscribe = this.listIngredientsShoppingList().subscribe({
      next: (value) => {
        this.ingredients.set(value);
      }
    });
    this.destroyRef.onDestroy(() => subscribe.unsubscribe());
  }
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
    const subscribe = this.http.post<{ name: string }>('http://localhost:8080/recipes/ingredients', ingredient)
      .subscribe({
        next: (value) => {
          console.log(value);
        }
      });
    this.destroyRef.onDestroy(() => subscribe.unsubscribe());
    console.log(this.ingredients());
  }

  addIngredients(ingredientsParam: Ingredient[]) {
    const subscribe = this.listIngredientsShoppingList().subscribe({
      next: (ingredients) => {

        this.ingredients.set(ingredients);
        this.ingredients.update((prevIngredient) => {
          const merged = [...prevIngredient];
          for (const ing of ingredientsParam) {
            console.log("merged ", merged);
            const idx = merged.findIndex(x => x.name === ing.name);
            console.log("idx ", idx);
            let ingredient: Ingredient;
            if (idx >= 0) {
              ingredient = new Ingredient(merged[idx].id, merged[idx].name, merged[idx].amount + ing.amount);
              merged[idx] = ingredient;
              this.putIngredient(ingredient);
            } else {
              ingredient = new Ingredient(null, ing.name, ing.amount);
              merged.push(ingredient);
              this.addIngredient(ingredient);
            }
          }
          return merged;
        });

      },
    });
    this.destroyRef.onDestroy(() => subscribe.unsubscribe());
  }

  putIngredient(ingredient: Ingredient) {
    const subscribe = this.http.put<{ name: string }>('http://localhost:8080/recipes/ingredients/' + ingredient.id, ingredient)
      .subscribe({
        next: (value) => {
          console.log(value);
        }
      });
    this.destroyRef.onDestroy(() => subscribe.unsubscribe());      
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

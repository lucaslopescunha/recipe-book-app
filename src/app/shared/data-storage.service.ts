import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    private http = inject(HttpClient);
    private recipeService = inject(RecipeService);

    storeRecipes(recipes: Recipe[]) {
        console.log('recipesssss', recipes);
        return this.http.post<{name: string}>("http://localhost:8080/recipes", recipes)
            .subscribe( {
                next: (response) => console.log(response)
    });
    }

}
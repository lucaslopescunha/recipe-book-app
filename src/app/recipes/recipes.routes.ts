import { Routes } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesResolverService } from "./recipes-resolver.service";

export const recipeRoutes: Routes = [
    {
        path: '',
        component: RecipeStartComponent
    },
    {
        path: 'new',
        component: RecipeEditComponent
    },
    {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService]
    },
    {
        path: ":id/edit",
        component: RecipeEditComponent,
        resolve: [RecipesResolverService]
    }
    
]
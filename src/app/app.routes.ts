import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { recipeRoutes } from './recipes/recipes.routes';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: '/recipes',
        pathMatch: 'full'
    },
    {
        path: 'recipes',
        component: RecipesComponent,
        children: recipeRoutes     
    },
    {
        path: 'shopping-list', 
        component: ShoppingListComponent
    }
];

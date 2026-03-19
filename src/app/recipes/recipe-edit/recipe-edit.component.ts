import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from '../../shared/data-storage.service';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css',
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;
  private recipeService = inject(RecipeService);
  private dataStorage = inject(DataStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  get recipeControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls
  }


  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          console.log("imprime o id ", params['id']);
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }
  recipes = () => this.recipeService.recipesChanged();

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.recipeForm.reset();
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'id': new FormControl(null),
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number, id: number) {
    console.log('TEM ID', id);
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    if(id !==null) {
      const subscription = this.recipeService.deleteIngredient(id).subscribe({
        next(value) {
          console.log("RESPONSE IS ", value);
        },
      }

      )
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let id = null;
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray<
      FormGroup<{
        id: FormControl<number | null>;
        name: FormControl<string | null>;
        amount: FormControl<number | null>;
      }>
    >([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      if (recipe) {
        id = recipe.id;
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'id': new FormControl(ingredient.id),
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            );
          }

        }
      }
    }

    this.recipeForm = new FormGroup({
      'id': new FormControl(id),
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

}

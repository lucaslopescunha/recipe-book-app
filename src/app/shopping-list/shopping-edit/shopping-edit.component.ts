import { Component, effect, EffectRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit {
  editMode = false;
  editedItemIndex: number | null = null;
  editedItem?: Ingredient;
  form!: FormGroup;
  slService = inject(ShoppingListService);
  stopEditingEffect!: EffectRef;

  constructor() {
    this.stopEditingEffect = effect(() => {
      const idx = this.slService.editing();
      if (idx === null) {
        this.editMode = false;
        this.editedItemIndex = null;
        this.editedItem = undefined;
        if (this.form) {
          this.form.reset();
        }
      } else {
        this.editMode = true;
        this.editedItemIndex = idx;
        this.editedItem = this.slService.getIngredient(idx);
        if (this.form && this.editedItem) {
          this.form.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        }
      }
    });


  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2),
        Validators.pattern(/^\d+$/)
        ]
      }),
    });

  }

  onSubmit() {
    console.log("editshop");
    const newIngredient: Ingredient = this.form.value;
    if (this.editMode && this.editedItemIndex) {
      console.log('update')
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      console.log('add')
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.form.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    if (this.editedItemIndex) {
      this.slService.deleteIngredient(this.editedItemIndex);
      this.onClear();
    }
  }

}

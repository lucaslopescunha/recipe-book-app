import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  imports: [ShoppingEditComponent, ReactiveFormsModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent  {
  slService = inject(ShoppingListService);
  ingredients = () => this.slService.listIngredients();

  constructor() { }
  
  ngOnInit() {
  }

  onEditItem(index: number) {
    this.slService.startEditing(index);
  }

}

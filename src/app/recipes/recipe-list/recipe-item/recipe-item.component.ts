import { Component, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css',
})
export class RecipeItemComponent implements OnInit{
  recipe = input<Recipe>();
  index = input<number>(0);
  even = input<boolean>(false);

  ngOnInit(): void {
    
  }
}

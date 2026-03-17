import { Component, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DropdownDirective } from '../shared/dropdown.directive';

@Component({
  selector: 'app-header',
  imports: [DropdownDirective, RouterLink, RouterLinkActive, ReactiveFormsModule],

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  featureSelected = output<string>();

  // 2. Create a method to trigger the event
  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
}

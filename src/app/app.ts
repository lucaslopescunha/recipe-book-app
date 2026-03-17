import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HeaderComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loadedFeature = signal<string>('recipe');
  
  // 4. Create the method that updates the property
  onNavigate(feature: string) {
    this.loadedFeature.set(feature);
  }
}

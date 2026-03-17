import { Directive, effect, ElementRef, HostListener, inject, Renderer2, signal } from "@angular/core";

@Directive({
    selector: '[appDropdown]',
    standalone: true
})
export class DropdownDirective {

  // Use a signal to manage the open/close state
  isOpen = signal(false);

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private clickListener!: () => void; // Stores the document click listener for cleanup

  constructor() {
    // Effect to react to changes in isOpen and apply/remove the 'show' class
    effect(() => {
      const hostElement = this.elementRef.nativeElement;
      const dropdownMenu = hostElement.querySelector('.dropdown-menu');

      if (this.isOpen()) {
        this.renderer.addClass(hostElement, 'show'); // Add 'show' to the host <li>
        if (dropdownMenu) {
          this.renderer.addClass(dropdownMenu, 'show'); // Add 'show' to the dropdown menu itself
        }
        // console.log('Dropdown opened'); // For debugging
      } else {
        this.renderer.removeClass(hostElement, 'show'); // Remove 'show' from the host <li>
        if (dropdownMenu) {
          this.renderer.removeClass(dropdownMenu, 'show'); // Remove 'show' from the dropdown menu
        }
        // console.log('Dropdown closed'); // For debugging
      }
    });
  }

  ngOnInit(): void {
    // Listen for clicks on the document to close the dropdown if clicked outside
    this.clickListener = this.renderer.listen(document, 'click', (event: Event) => {
      // Check if the click occurred outside of this dropdown's host element
      // and if the dropdown is currently open
      if (!this.elementRef.nativeElement.contains(event.target) && this.isOpen()) {
        this.isOpen.set(false); // Close the dropdown
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up the document-wide event listener to prevent memory leaks
    if (this.clickListener) {
      this.clickListener();
    }
  }

  // Listen for clicks on the host element itself (the <li> with appDropdown)
  // This listener will toggle the dropdown when 'Manage' or any part of the <li> is clicked
  @HostListener('click') toggleOpen() {
    // Toggle the signal value. If it's true, it becomes false; if false, it becomes true.
    this.isOpen.update(currentValue => !currentValue);
  }
}

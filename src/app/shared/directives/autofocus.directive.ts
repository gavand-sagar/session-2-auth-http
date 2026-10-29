import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';

// Puts the cursor in this element when the page opens.
// Usage: <input appAutofocus />
@Directive({ selector: 'h1' })
export class AutofocusDirective implements AfterViewInit {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}



// // Usage: <input class="appAutoFocus" />
// @Directive({ selector: '.appAutofocus' })
// export class AutofocusDirective implements AfterViewInit {
//   private el = inject<ElementRef<HTMLElement>>(ElementRef);
//     appAutoFocus:string = input()
//   ngAfterViewInit() {
//     this.el.nativeElement.focus();
//   }
// }


// Usage: <input class="active"/>
// @Directive({ selector: 'input.active' })
// export class AutofocusDirective implements AfterViewInit {
//   private el = inject<ElementRef<HTMLElement>>(ElementRef);

//   ngAfterViewInit() {
//     this.el.nativeElement.focus();
//   }
// }

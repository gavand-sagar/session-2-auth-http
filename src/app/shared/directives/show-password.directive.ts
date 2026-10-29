import { Directive, input } from '@angular/core';

// Switches a password field between hidden and visible text.
// Usage: <input type="password" [appShowPassword]="show()" />
@Directive({
  selector: 'input[appShowPassword]',
  host: { '[type]': 'appShowPassword() ? "text" : "password"' },
})
export class ShowPasswordDirective {
  appShowPassword = input(false);
}

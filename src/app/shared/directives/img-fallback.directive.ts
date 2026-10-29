import { Directive, ElementRef, inject, input } from '@angular/core';

// Shows a default picture when an image fails to load (broken link, 404).
// Usage: <img [src]="product.imageUrl" appImgFallback />
//        <img [src]="user.photo" appImgFallback="/default-avatar.png" />
@Directive({
  selector: 'img[appImgFallback]',
  host: { '(error)': 'useFallback()' },
})
export class ImgFallbackDirective {
  fallback = input('', { alias: 'appImgFallback' });
  private el = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private failed = false;

  useFallback() {
    if (this.failed) return; // stop here if the fallback is broken too
    this.failed = true;
    this.el.nativeElement.src = this.fallback() || '/no-image.svg';
  }
}

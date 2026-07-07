import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFallbackImage]',
})
export class FallbackImage {
  constructor(private el: ElementRef) {}

  @HostListener('error')
  onError() {
    this.el.nativeElement.src = 'default-avatar.jpg'
  }
}

// Angular import
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

// project import
import screenfull from 'screenfull';
import { PlatformService } from 'src/app/core/services/platform.service';

@Directive({
  selector: '[appToggleFullScreen]'
})
export class ToggleFullScreenDirective {
  private elements = inject(ElementRef);
  private platform = inject(PlatformService);

  @HostListener('click')
  onClick() {
    if (!this.platform.isBrowser || !screenfull.isEnabled) {
      return;
    }

    const icon = this.elements.nativeElement.querySelector('.feather');
    icon?.classList.toggle('icon-maximize');
    icon?.classList.toggle('icon-minimize');
    screenfull.toggle();
  }
}

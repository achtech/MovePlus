// angular import
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PlatformService } from 'src/app/core/services/platform.service';

import screenfull from 'screenfull';

@Component({
  selector: 'app-nav-left',
  imports: [SharedModule],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit, OnDestroy {
  private platform = inject(PlatformService);
  private changeHandler = () => {
    this.screenFull = screenfull.isEnabled ? screenfull.isFullscreen : false;
  };

  screenFull = true;

  ngOnInit() {
    if (!this.platform.isBrowser || !screenfull.isEnabled) {
      return;
    }

    this.screenFull = screenfull.isFullscreen;
    screenfull.on('change', this.changeHandler);
  }

  ngOnDestroy() {
    if (this.platform.isBrowser && screenfull.isEnabled) {
      screenfull.off('change', this.changeHandler);
    }
  }

  toggleFullscreen() {
    if (this.platform.isBrowser && screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }
}

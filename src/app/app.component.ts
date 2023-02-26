import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { media } from './utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isMobile = false;
  showMenu = true;

  ngOnInit() {
    media('(max-width: 1023px)').subscribe(
      (matches) => (this.isMobile = matches)
    );
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}

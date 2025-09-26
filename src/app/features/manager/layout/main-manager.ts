import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-manager',
  standalone: true,
  templateUrl: './main-manager.html',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./main-manager.css']
})

export class MainManagerComponent {

}

import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './shared/header/header';
import {MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SignatureComponent} from './signature/signature.component'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SignatureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LandoKosher';
}

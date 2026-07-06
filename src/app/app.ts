import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { ExtenderSesionModal } from './modals/extender-sesion-modal/extender-sesion-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, ExtenderSesionModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FEDERICO-FREDIANI-BALDI-TP2-PROG4-2026-C1-FRONT');
}

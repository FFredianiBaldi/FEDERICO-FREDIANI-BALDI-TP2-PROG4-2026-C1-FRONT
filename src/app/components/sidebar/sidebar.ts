import { Component, AfterViewInit, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements AfterViewInit{

  ngAfterViewInit(): void {
    this.initDropdowns();
  }
  constructor(public auth: AuthService) {
    effect(() => {
      if(this.auth.usuario()) {
        setTimeout(() => this.initDropdowns());
      }
    })
  }

  initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(el => {
      const instance = bootstrap.Dropdown.getInstance(el);
      if(!instance) {
        bootstrap.Dropdown.getOrCreateInstance(el);
      }
    })
  }
}

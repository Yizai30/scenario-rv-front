import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toAppComponent(): void {
    this.router.navigate(['app-component']);
  }

  toAppExclude(): void {
    this.router.navigate(['app-exclude']);
  }

  toAppCirculate(): void {
    this.router.navigate(['app-circulate']);
  }

  toAppSmt(): void {
    this.router.navigate(['app-smt']);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Комплектовка';
  cookieEnabled: boolean | undefined;
  ngOnInit(): void {
    document.cookie = 'testCookie'
    this.cookieEnabled = document.cookie.indexOf('testCookie') !== -1;
  }
}

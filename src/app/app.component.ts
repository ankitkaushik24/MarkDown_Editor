import {Component} from '@angular/core';
import {MarkDownModel} from './mark-down.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  defaultText = `**Angular** is a TypeScript based //opensource// front-end web application platform.
  [[ https://angular.io/ | Learn more ]]`;

  templateMarkup;

  onValueChange(event: MarkDownModel) {
    console.log(event.markDown);
    console.log(event.html);
    this.templateMarkup = event.html;
  }
}

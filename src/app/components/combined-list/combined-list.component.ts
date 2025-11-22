import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-combined-list',
  templateUrl: './combined-list.component.html',
  styleUrls: ['./combined-list.component.css']
})
export class CombinedListComponent {
  @Input() list: any[] = [];

}

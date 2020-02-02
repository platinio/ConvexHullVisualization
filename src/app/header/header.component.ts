import { Component, OnInit } from '@angular/core';

export interface SelectItem
{
    value: string;
    viewValue: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit 
{
  public algorithmSelect: SelectItem[] = [
    {value: 'gift-wrapping', viewValue: 'Gift Wrapping'},
    {value: 'quick-hull', viewValue: 'Quick Hull'}    
  ];

  public selectedAlgorithm = "gift-wrapping";

  constructor() { }

  ngOnInit() {
  }

  formatLabel(value: number) {
    
    return  value + 'x';
  }

}

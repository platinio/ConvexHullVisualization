import { Component, OnInit , Output , EventEmitter} from '@angular/core';

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

  @Output() selectedAlgorithmChange = new EventEmitter();
  @Output() playClick = new EventEmitter();

  constructor() { }
  ngOnInit() {  }

  public onSelectedAlgorithmChange()
  {
    this.selectedAlgorithmChange.emit();
  }

  public onPlay()
  {
    this.playClick.emit();
  }

}

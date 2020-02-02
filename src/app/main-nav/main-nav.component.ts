import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface SelectItem
{
    value: string;
    viewValue: string;
}

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  public algorithmSelect: SelectItem[] = [
    {value: 'gift-wrapping', viewValue: 'Gift Wrapping'},
    {value: 'quick-hull', viewValue: 'Quick Hull'}    
  ];

  public selectedAlgorithm = "gift-wrapping";


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  formatLabel(value: number) {
    
    return  value + 'x';
  }

}

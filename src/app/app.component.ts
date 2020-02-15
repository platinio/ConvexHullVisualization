import { Component } from '@angular/core';
import { SettingsService } from './settings-service/settings-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  title = 'ConvexHullVisualization';
  constructor(public settingsService : SettingsService){}
  
}

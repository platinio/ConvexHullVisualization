import { BrowserModule } from '@angular/platform-browser';
import { NgModule , Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';

import { TweenService } from './canvas/services/tween.service';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ TweenService ],
  bootstrap: [AppComponent]
})

@Injectable()
export class AppModule
{
    constructor(private tweenService : TweenService){}
}
